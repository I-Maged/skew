import { cn } from "@/lib/cn";

interface BiasMeterProps {
  left: number;
  center: number;
  right: number;
  className?: string;
  showLabels?: boolean;
}

export function BiasMeter({
  left,
  center,
  right,
  className,
  showLabels = true,
}: BiasMeterProps) {
  const total = left + center + right || 1;
  const l = (left / total) * 100;
  const c = (center / total) * 100;
  const r = (right / total) * 100;

  return (
    <div data-testid="bias-meter" className={cn("w-full", className)}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-bg-secondary">
        <div
          className="h-full bg-bias-left transition-all"
          style={{ width: `${l}%` }}
          aria-label={`Left ${left}%`}
        />
        <div
          className="h-full bg-bias-center transition-all"
          style={{ width: `${c}%` }}
          aria-label={`Center ${center}%`}
        />
        <div
          className="h-full bg-bias-right transition-all"
          style={{ width: `${r}%` }}
          aria-label={`Right ${right}%`}
        />
      </div>
      {showLabels && (
        <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-bias-left" />
            Left {left}%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-bias-center" />
            Center {center}%
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-bias-right" />
            Right {right}%
          </span>
        </div>
      )}
    </div>
  );
}