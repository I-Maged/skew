import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BiasMeter } from "@/components/ui/bias-meter";

interface BiasAnalysisCardProps {
  overallLabel: string;
  basedOn: string;
  left: number;
  center: number;
  right: number;
  analysisText: string;
}

export function BiasAnalysisCard({
  overallLabel,
  basedOn,
  left,
  center,
  right,
  analysisText,
}: BiasAnalysisCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-base font-semibold text-text-primary">
          Bias Analysis
        </h3>
        <span className="text-xs text-text-secondary" aria-hidden="true">
          ⓘ
        </span>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-bias-right">{overallLabel}</div>
        <div className="text-xs text-text-secondary">{basedOn}</div>
      </div>
      <div className="mt-4">
        <BiasMeter left={left} center={center} right={right} showLabels />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">
        {analysisText}
      </p>
      <Button variant="outline" size="sm" className="mt-4">
        How We Analyze Bias
      </Button>
    </Card>
  );
}

interface AISummaryCardProps {
  generated: string;
  readTime: string;
  bullets: string[];
  disclaimer: string;
}

export function AISummaryCard({
  generated,
  readTime,
  bullets,
  disclaimer,
}: AISummaryCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-base font-semibold text-text-primary">
          AI Summary
        </h3>
        <span className="text-xs text-text-secondary" aria-hidden="true">
          ⓘ
        </span>
      </div>
      <div className="mt-2 text-xs text-text-secondary">
        {generated} · {readTime}
      </div>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text-primary">
        {bullets.map((bullet, i) => (
          <li key={i}>{bullet}</li>
        ))}
      </ul>
      <p className="mt-3 text-xs italic text-text-secondary">{disclaimer}</p>
      <Button variant="outline" size="sm" className="mt-4">
        Provide Feedback
      </Button>
    </Card>
  );
}

interface SourceBreakdownCardProps {
  left: { count: number; percent: number };
  center: { count: number; percent: number };
  right: { count: number; percent: number };
  topSources: { name: string; bias: "Left" | "Center" | "Right" }[];
}

export function SourceBreakdownCard({
  left,
  center,
  right,
  topSources,
}: SourceBreakdownCardProps) {
  const total = left.count + center.count + right.count || 1;
  const rows = [
    { label: "Left", value: left, color: "bg-bias-left" },
    { label: "Center", value: center, color: "bg-bias-center" },
    { label: "Right", value: right, color: "bg-bias-right" },
  ];

  return (
    <Card className="p-5">
      <h3 className="font-sans text-base font-semibold text-text-primary">
        Source Breakdown
      </h3>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>{row.label}</span>
              <span>
                {row.value.count} · {row.value.percent}%
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-bg-secondary">
              <div
                className={`h-full ${row.color}`}
                style={{ width: `${(row.value.count / total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-xs font-semibold text-text-secondary">Top Sources</div>
        <ul className="mt-2 space-y-2 text-sm">
          {topSources.map((source) => (
            <li
              key={source.name}
              className="flex items-center justify-between text-text-primary"
            >
              <span>{source.name}</span>
              <span className="text-xs text-text-secondary">{source.bias}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button variant="outline" size="sm" className="mt-4">
        View All Sources
      </Button>
    </Card>
  );
}