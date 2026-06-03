// The three macOS-style window dots shared by the hero and dashboard-showcase
// browser chrome. The container class differs per surface (.windots / .browser-dots)
// and carries the layout, so it's passed in.
export function TrafficLights({ className }: { className?: string }) {
  return (
    <div className={className}>
      <i style={{ background: "#FF5F57" }} />
      <i style={{ background: "#FEBC2E" }} />
      <i style={{ background: "#28C840" }} />
    </div>
  );
}
