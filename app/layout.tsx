import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Poppins, Source_Serif_4, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "biasly News",
  description:
    "Balanced news coverage powered by AI — sentiment and framing insights.",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem("biasly-theme");
    var mode = stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = mode === "dark" || (mode === "auto" && prefersDark);
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    document.documentElement.dataset.themeMode = mode;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${poppins.variable} ${sourceSerif.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
      <ClerkProvider>{children}</ClerkProvider>
    </body>
    </html>
  );
}