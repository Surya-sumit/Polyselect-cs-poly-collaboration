export default function ScoreBar({ label, value, max = 10, displayValue, color = "teal" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = color === "amber" ? "bg-amber" : "bg-teal";

  return (
    <div className="flex items-center gap-3 py-1">
      <div className="w-32 shrink-0 text-xs font-mono text-inkfaint truncate">{label}</div>
      <div className="flex-1 h-2 bg-line/60 rounded-full overflow-hidden">
        <div
          className={`h-full ${fill} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-12 shrink-0 text-right text-xs font-mono text-ink">
        {displayValue !== undefined ? displayValue : value}
      </div>
    </div>
  );
}
