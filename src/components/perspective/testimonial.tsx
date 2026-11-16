/* One quote from a real coach or player. Renders nothing until a real,
   approved quote is set here: the page never ships placeholder words or an
   invented name. */
type Quote = { words: string; name: string; role: string };

const QUOTE: Quote | null = null;

export function Testimonial() {
  if (!QUOTE) return null;
  return (
    <section className="band" id="quote">
      <div className="wrap">
        <figure className="quote reveal">
          <blockquote>{QUOTE.words}</blockquote>
          <figcaption>
            <strong>{QUOTE.name}</strong>
            <span>{QUOTE.role}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
