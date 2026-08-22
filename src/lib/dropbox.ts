// Server-only Dropbox client, scoped to one job: seeing what has landed in the
// File Request folder that /send-a-match points coaches at.
//
// Why this exists rather than a webhook. Dropbox webhooks notify you that
// *something* changed in an account — they carry no file details — so you still
// have to call list_folder afterwards, and you additionally have to stand up a
// public endpoint, answer the GET verification challenge, and persist a cursor.
// For a pilot taking a handful of uploads a week, a scheduled sweep does the
// same work with none of that surface, and it self-heals: a missed run is
// picked up by the next one, whereas a missed webhook is gone.
//
// Auth is the refresh-token flow. Dropbox short-lived access tokens expire in
// four hours, so a long-lived token pasted into an env var stops working mid-
// season with no warning; the refresh token doesn't expire and buys a new
// access token per request.

const API = "https://api.dropboxapi.com/2";

export type DropboxFile = {
  name: string;
  pathDisplay: string;
  sizeBytes: number;
  // When Dropbox finished receiving it, not when the camera wrote it.
  serverModified: string;
};

function config() {
  const appKey = process.env.DROPBOX_APP_KEY;
  const appSecret = process.env.DROPBOX_APP_SECRET;
  const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
  if (!appKey || !appSecret || !refreshToken) return null;
  return { appKey, appSecret, refreshToken };
}

export function isDropboxConfigured(): boolean {
  return config() !== null;
}

async function accessToken(): Promise<string> {
  const cfg = config();
  if (!cfg) throw new Error("Dropbox is not configured.");

  const res = await fetch("https://api.dropboxapi.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${cfg.appKey}:${cfg.appSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: cfg.refreshToken,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Dropbox token refresh failed (${res.status}).`);
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Dropbox returned no access token.");
  return data.access_token;
}

// The team account's files sit outside the member's personal home namespace, so
// a bare "/Pilot Video Submissions" resolves to nothing without this header
// pointing path resolution at the team root.
function pathRootHeader(): Record<string, string> {
  const ns = process.env.DROPBOX_ROOT_NAMESPACE_ID;
  return ns
    ? { "Dropbox-API-Path-Root": JSON.stringify({ ".tag": "root", root: ns }) }
    : {};
}

type ListFolderResponse = {
  entries: {
    ".tag": string;
    name: string;
    path_display?: string;
    size?: number;
    server_modified?: string;
  }[];
  cursor: string;
  has_more: boolean;
};

/** Every file directly inside `path`, following pagination to the end. */
export async function listFolderFiles(path: string): Promise<DropboxFile[]> {
  const token = await accessToken();
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...pathRootHeader(),
  };

  const files: DropboxFile[] = [];
  let body: string = JSON.stringify({ path, recursive: false, limit: 500 });
  let url = `${API}/files/list_folder`;

  // Bounded so a pathological folder can't spin a serverless function until it
  // is killed mid-way; 20 pages is 10k files, far past anything this folder sees.
  for (let page = 0; page < 20; page++) {
    const res = await fetch(url, { method: "POST", headers, body, cache: "no-store" });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`Dropbox list_folder failed (${res.status}): ${detail}`);
    }
    const data = (await res.json()) as ListFolderResponse;

    for (const entry of data.entries) {
      if (entry[".tag"] !== "file") continue;
      files.push({
        name: entry.name,
        pathDisplay: entry.path_display ?? `${path}/${entry.name}`,
        sizeBytes: entry.size ?? 0,
        serverModified: entry.server_modified ?? "",
      });
    }

    if (!data.has_more) break;
    url = `${API}/files/list_folder/continue`;
    body = JSON.stringify({ cursor: data.cursor });
  }

  return files;
}

/**
 * Dropbox File Requests store an upload as "<name the uploader typed> - <their
 * filename>". That prefix is the only link between a file and the coach who
 * sent it — nothing else about the upload carries identity — so it is what the
 * sweep matches on. Returns null when the separator is missing, which means a
 * file was dropped into the folder by hand rather than through the request.
 */
export function uploaderNameFrom(fileName: string): string | null {
  const separator = fileName.indexOf(" - ");
  if (separator <= 0) return null;
  return fileName.slice(0, separator).trim() || null;
}
