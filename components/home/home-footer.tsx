import { X, Globe, Mail, Rss } from "lucide-react";

const companyLinks = ["About", "Careers", "Press", "Contact"];
const helpLinks = ["Help Center", "Guides", "Privacy Policy", "Terms of Service"];

export function HomeFooter() {
  return (
    <footer className="bg-[#242424] px-0 pt-7 pb-[14px] text-gray-300">
      <div className="mx-auto max-w-[936px] px-[44px]">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-2xl font-bold tracking-tight text-white">
              biasly
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              News
            </div>
            <p className="mt-3 text-[11px] text-gray-400">
              Balanced news coverage
              <br />
              powered by AI.
            </p>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold text-white">Company</h3>
            <ul className="mt-3 space-y-2 text-[11px] text-gray-400">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold text-white">Help</h3>
            <ul className="mt-3 space-y-2 text-[11px] text-gray-400">
              {helpLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[12px] font-semibold text-white">Connect</h3>
            <div className="mt-3 flex gap-3 text-gray-400">
              <a href="#" aria-label="X" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X size={16} strokeWidth={2} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Globe size={16} strokeWidth={2} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Mail size={16} strokeWidth={2} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Rss size={16} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-white/10 pt-3 text-[10px] text-gray-500">
          © 2026 Biasly News. All rights reserved.
        </div>
      </div>
    </footer>
  );
}