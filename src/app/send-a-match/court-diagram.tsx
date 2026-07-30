/* The camera-angle diagram: a top-down court in hairline strokes with the two
   camera positions marked. It is the qualifier made visual — a coach reads it
   in a second and knows, before spending an hour on an upload, whether their
   film will work.

   Schematic, not illustrative: no perspective, no fills, no colour beyond the
   green check on the angle that works. Court geometry is close to true (singles
   lines inset, service line off the net, center marks on each baseline), just
   foreshortened along its length so the diagram doesn't tower over the section
   it belongs to.

   The court is centred in the viewBox: its centre line sits at x=150 of 300, so
   the 90 units of air to its left balance the side-camera group to its right.
   That is what keeps the court itself centred rather than shoved left, and it is
   why the "doesn't work" label wraps to two lines — one line is wide enough to
   push the whole composition off axis. */

// One camera, drawn pointing up, scaled up enough to read at ~40px: a body, a
// lens barrel on the court-facing side, and a knocked-out white eye. Rotated
// into place by the caller.
function Camera({
  x,
  y,
  rotate = 0,
  tone,
}: {
  x: number;
  y: number;
  rotate?: number;
  tone: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(1.3)`}>
      <g fill={tone}>
        <rect x="-9" y="-5" width="18" height="12" rx="3" />
        <path d="M-5 -5L-3 -11h6l2 6z" />
      </g>
      <circle cx="0" cy="1.5" r="2.6" fill="var(--surface)" />
    </g>
  );
}

export function CourtDiagram() {
  return (
    <svg
      className="sm-court"
      viewBox="0 0 300 308"
      role="img"
      aria-labelledby="sm-court-title sm-court-desc"
    >
      <title id="sm-court-title">Where to put the camera</title>
      <desc id="sm-court-desc">
        A top-down tennis court. A camera centered behind the baseline, marked
        with a green check, works. A camera at the side of the court, marked
        with a grey cross, doesn&rsquo;t work yet.
      </desc>

      {/* ---- The court, centred on x=150 ---- */}
      <g
        fill="none"
        stroke="var(--sm-court-line)"
        strokeWidth="1.25"
        strokeLinecap="square"
      >
        {/* doubles boundary */}
        <rect x="90" y="20" width="120" height="220" />
        {/* singles sidelines */}
        <path d="M105 20V240M195 20V240" />
        {/* service lines + center service line */}
        <path d="M105 71h90M105 189h90M150 71v118" />
        {/* center marks on each baseline */}
        <path d="M150 20v6M150 234v6" />
        {/* the net, standing slightly proud of the sidelines */}
        <path d="M82 130h136" />
      </g>

      {/* ---- Works: behind the baseline, centred on the court ---- */}
      <Camera x={150} y={266} tone="var(--ink-secondary)" />
      <circle cx="174" cy="254" r="8" fill="var(--win-tint)" />
      <path
        d="M170.5 254l2.5 2.5 4.5-5"
        fill="none"
        stroke="var(--win-green)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text className="sm-court-label" x="150" y="296" textAnchor="middle">
        Works
      </text>

      {/* ---- Doesn't work yet: beside the court ---- */}
      <Camera x={258} y={130} rotate={-90} tone="var(--ink-label)" />
      <circle cx="274" cy="112" r="8" fill="var(--hairline)" />
      <path
        d="M271 109l6 6M277 109l-6 6"
        fill="none"
        stroke="var(--ink-label)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <text
        className="sm-court-label is-muted"
        x="258"
        y="164"
        textAnchor="middle"
      >
        Doesn&rsquo;t
      </text>
      <text
        className="sm-court-label is-muted"
        x="258"
        y="180"
        textAnchor="middle"
      >
        work yet
      </text>
    </svg>
  );
}
