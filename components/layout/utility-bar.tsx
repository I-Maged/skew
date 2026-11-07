import { Container } from "@/components/layout/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function UtilityBar() {
  return (
    <div
      data-testid="utility-bar"
      className="border-b border-border bg-surface text-xs text-text-secondary"
    >
      <Container>
        <div className="flex items-center justify-between gap-4 py-2">
          <span className="hidden sm:inline">Browser Extension</span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="hidden md:inline">Set Location</span>
            <span className="hidden md:inline">International Edition</span>
          </div>
        </div>
      </Container>
    </div>
  );
}