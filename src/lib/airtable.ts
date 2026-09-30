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
