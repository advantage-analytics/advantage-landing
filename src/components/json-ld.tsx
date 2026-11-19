/* Structured data (schema.org JSON-LD) for search engines and AI answer
   engines. Rendered as a plain <script>, so it works from server and client
   components alike and is in the HTML before hydration. `<` is escaped so a
   string in the data can never close the script tag early.

   Several items go out as one object with an `@graph` list, not as a bare
   array: the same meaning to search engines, and a top-level object is what
   every reader of JSON-LD expects (some browser extensions read
   `data["@context"]` and throw on an array). */
export function JsonLd({ data }: { data: object | object[] }) {
  const doc = Array.isArray(data)
    ? {
        "@context": "https://schema.org",
        "@graph": data.map((item) => {
          const rest: Record<string, unknown> = { ...item };
          delete rest["@context"];
          return rest;
        }),
      }
    : data;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(doc).replace(/</g, "\\u003c") }}
    />
  );
}
