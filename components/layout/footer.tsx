import { Globe, Mail, Rss, Share2 } from "lucide-react";
import { Container } from "@/components/layout/container";

const columns = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Help",
    links: ["Help Center", "Guides", "Privacy Policy", "Terms of Service"],
  },
];

export function Footer() {
  return (
    <footer data-testid="footer" className="mt-auto bg-footer text-gray-300">
      <Container>
        <div className="grid gap-10 py-12 md:grid-cols-4">
          <div>
            <div className="font-sans text-2xl font-bold tracking-tight text-white">
              biasly<span className="text-bias-right">.</span> News
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Balanced news coverage powered by AI.
            </p>
            <div className="mt-4 flex gap-3 text-gray-400">
              <Globe size={18} strokeWidth={2} />
              <Mail size={18} strokeWidth={2} />
              <Rss size={18} strokeWidth={2} />
              <Share2 size={18} strokeWidth={2} />
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h3 className="text-sm font-semibold text-white">Connect</h3>
            <p className="mt-3 text-sm text-gray-400">
              Follow us for balanced coverage.
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-xs text-gray-500">
          © 2026 biasly News. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}