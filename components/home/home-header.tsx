import Link from "next/link";
import { Menu } from "lucide-react";

const navItems = ["Home", "For You", "Local", "Blindspot"];

export function HomeHeader() {
  return (
    <header
      data-testid="header"
      className="h-[58px] border-b border-[#bfc0bd] bg-white"
    >
      <div className="mx-auto flex h-full max-w-[936px] items-center justify-between px-[44px]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Menu"
            className="text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
          <Link href="/" className="flex w-[90px] flex-col leading-none">
            <span className="text-xl font-bold tracking-tight text-[#111111]">
              biasly
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-[#444444]">
              News
            </span>
          </Link>
        </div>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 text-[14px] text-[#444444] md:flex"
        >
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="relative rounded-sm hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
            >
              {item}
              {item === "Home" && (
                <span className="absolute -bottom-[18px] left-0 h-[2px] w-full bg-[#111111]" />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden h-9 w-[102px] items-center justify-center rounded-[5px] bg-[#111111] text-[13px] font-semibold text-white hover:opacity-82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] sm:inline-flex"
          >
            Subscribe
          </button>
          <button
            type="button"
            className="hidden h-9 w-[102px] items-center justify-center rounded-[5px] border border-[#bfc0bd] bg-white text-[13px] font-semibold text-[#111111] hover:opacity-82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] sm:inline-flex"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}