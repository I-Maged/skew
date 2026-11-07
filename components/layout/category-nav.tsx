import { Container } from "@/components/layout/container";

const categories = [
  "World",
  "Politics",
  "Technology",
  "Business",
  "Health",
  "Science",
  "Sports",
  "Entertainment",
];

export function CategoryNav() {
  return (
    <div data-testid="category-nav" className="border-b border-border bg-bg-primary">
      <Container>
        <nav
          aria-label="Categories"
          className="flex gap-6 overflow-x-auto py-3 text-sm font-medium text-text-secondary scrollbar-none"
        >
          {categories.map((category) => (
            <a
              key={category}
              href="#"
              className="whitespace-nowrap transition-colors hover:text-text-primary"
            >
              {category}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}