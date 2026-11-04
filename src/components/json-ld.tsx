/* Structured data (schema.org JSON-LD) for search engines and AI answer
   engines. Rendered as a plain <script>, so it works from server and client
   components alike and is in the HTML before hydration. `<` is escaped so a
   string in the data can never close the script tag early. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
