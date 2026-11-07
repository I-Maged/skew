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
              className="whitespace-nowrap rounded-sm transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
            >
              {category}
            </a>
          ))}
        </nav>
      </Container>
    </div>
  );
}