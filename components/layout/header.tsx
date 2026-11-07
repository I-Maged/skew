import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";

const navLinks = ["Home", "For You", "Local", "Blindspot"];

export function Header() {
  return (
    <header data-testid="header" className="border-b border-border bg-bg-primary">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-sans text-2xl font-bold tracking-tight text-text-primary"
            >
              biasly<span className="text-bias-right">.</span> News
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="rounded-sm text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary md:inline-flex"
            >
              <Search size={18} strokeWidth={2} />
            </button>
            <Button variant="outline" size="sm">
              Subscribe
            </Button>
            <Button variant="primary" size="sm">
              Login
            </Button>
            <button
              type="button"
              aria-label="Menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary md:hidden"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}