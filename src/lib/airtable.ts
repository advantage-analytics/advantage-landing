// Server-only helper for writing form submissions to Airtable via the REST API.
// We use plain fetch (no SDK) to keep the dependency surface small. Never import
// this from a Client Component — it reads AIRTABLE_TOKEN, which must stay server-side.

const AIRTABLE_API = "https://api.airtable.com/v0";

export async function createAirtableRecord(
  table: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error(
      "Airtable is not configured (missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID).",
    );
  }

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    // typecast lets Airtable coerce strings into select/date fields by name.
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Airtable write failed (${res.status}): ${detail}`);
  }
}

// Reading and updating exist for one caller: the Dropbox sweep, which has to
// find the submission a newly-arrived file belongs to and then mark it handled.
// Everything else in this app only ever writes new rows.

export type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
};

export async function listAirtableRecords(
  table: string,
  options: {
    filterByFormula?: string;
    maxRecords?: number;
    // Airtable's sort parameter, applied server-side.
    sort?: { field: string; direction: "asc" | "desc" }[];
  } = {},
): Promise<AirtableRecord[]> {
  const { token, baseId } = credentials();

  const params = new URLSearchParams();
  if (options.filterByFormula) params.set("filterByFormula", options.filterByFormula);
  if (options.maxRecords) params.set("maxRecords", String(options.maxRecords));
  options.sort?.forEach((s, i) => {
    params.set(`sort[${i}][field]`, s.field);
    params.set(`sort[${i}][direction]`, s.direction);
  });

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}?${params}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Airtable list failed (${res.status}): ${detail}`);
  }

  const data = (await res.json()) as { records?: AirtableRecord[] };
  return data.records ?? [];
}

export async function updateAirtableRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const { token, baseId } = credentials();

  const url = `${AIRTABLE_API}/${baseId}/${encodeURIComponent(table)}/${recordId}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields, typecast: true }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Airtable update failed (${res.status}): ${detail}`);
  }
}

function credentials(): { token: string; baseId: string } {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!token || !baseId) {
    throw new Error(
      "Airtable is not configured (missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID).",
    );
  }
  return { token, baseId };
}
