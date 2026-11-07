# Prompt: App Design System from UI Reference

## Goal

Implement the shared visual design system for `biasly News` based on the three
reference images in `ui-imgs/` (`01-ui-design-system.png`, `02-homepage.png`,
`03-news-details-page.png`). Deliver the foundation plus core UI primitives so
subsequent pages can be built consistently.

## Skills read

- `node_modules/next/dist/docs/` (Next.js App Router, fonts, styling)
- Existing project patterns for Tailwind v4

## Existing code inspected

- `app/layout.tsx` (default Geist fonts)
- `app/globals.css` (default Tailwind tokens)
- `app/page.tsx` (placeholder homepage)
- `package.json`, `tsconfig.json`, `next.config.ts`
- `ui-imgs/` reference screenshots

## Decisions / assumptions

- Tailwind CSS v4 with `@theme inline` and CSS variables.
- UI font: **Poppins** (`next/font/google`).
- Article font: **Source Serif 4** (`next/font/google`) for news titles/body on the details page.
- Mono font retained as **Geist Mono** for logs/debug if needed.
- Icons: **lucide-react** (2px stroke, rounded, outline style).
- Spacing uses Tailwind's default 4px-based scale (p-1 = 4px).
- Container max width 1280px.
- Light theme default; dark mode toggled via `.dark` class and persisted in `localStorage` ("light"/"dark"/"auto").
- Follow "system" preference when "auto".
- Canonical colors from `01-ui-design-system.png` (design system doc is authoritative over page estimates):
  - text primary `#000000` / dark `#F5F5F5`
  - text secondary `#5B728D` / dark `#A0AEC0`
  - surface `#F0F0F6` / dark `#14141A`
  - bg primary `#FFFFFF` / dark `#0A0A0F`
  - bg secondary `#F0F0F0` / dark `#1F1F27`
  - border `#E5E7EB` / dark `#2A2A35`
  - bias-left `#B4232B` / dark `#E0555C`
  - bias-center `#E5E7EB` / dark `#4B5563`
  - bias-right `#1D46DB` / dark `#4F7CFF`
  - footer `#1A1A1A`
- Radius: sm 4px, md 8px, lg 12px, full 9999px.
- Shadows: sm/md/lg soft `rgba(0,0,0,...)`.

## Files likely to change

- `package.json` (add `lucide-react`)
- `app/globals.css`
- `app/layout.tsx`
- `lib/theme.ts` (new)
- `components/ui/button.tsx` (new)
- `components/ui/badge.tsx` (new)
- `components/ui/card.tsx` (new)
- `components/ui/input.tsx` (new)
- `components/ui/bias-meter.tsx` (new)
- `components/layout/container.tsx` (new)
- `components/layout/header.tsx` (new)
- `components/layout/footer.tsx` (new)
- `app/page.tsx` (simple design-system showcase, non-final)

## Implementation requirements

1. Install `lucide-react`.
2. Replace Geist sans with **Poppins** and add **Source Serif 4**; keep Geist Mono.
3. Rebuild `globals.css`:
   - Tailwind import
   - `:root` light variables + `.dark` overrides
   - `@theme inline` mapping variables to Tailwind color/font/radius/shadow tokens
   - base body styles
4. Create `lib/theme.ts` with storage helpers + `applyTheme(mode)`.
5. Create theme toggle component (Header area) supporting Light/Dark/Auto, persisting preference.
6. Implement UI primitives:
   - Button variants: primary (black bg, white text), secondary (white bg, black border), outline (transparent, grey border), ghost/text, disabled.
   - Badge/Chip pill.
   - Card surface.
   - Input with focus ring.
   - BiasMeter tri-segment bar with percentages (left/center/right, sums to 100).
7. Implement layout: Container (max 1280px), UtilityBar, Header, CategoryNav, Footer.
8. Update `app/page.tsx` to a minimal showcase of tokens/components (not final homepage) to visually verify design system. Mark clearly as placeholder.
9. Ensure dark mode classes and transitions.

## Security requirements

- No secrets exposed to browser. Theme toggle is client-only local state.
- No server mutation or scraping.

## Acceptance criteria

- `npm run dev` renders refreshed design tokens.
- Desktop (1280px) shows correct colors/spacing/typography.
- Responsive collapse verified at 768px and 375px.
- Dark mode toggle works and persists after reload.
- `BiasMeter` percentages sum to 100.
- All interactive elements have visible focus states.
- `typecheck`, `lint`, and `build` pass.

## Checks to run

- `npm install`
- `npm run typecheck` (add script if absent: `tsc --noEmit`)
- `npm run lint`
- `npm run build`

## Exact manual test steps

1. Start dev server: `npm run dev`
2. Open `http://localhost:3000`
3. Verify Poppins font, colors, spacing, bias meter.
4. Toggle theme Light/Dark/Auto and reload; confirm persistence.
5. Resize browser to mobile/tablet widths; confirm responsive layout.
6. Run `npm run typecheck`, `npm run lint`, `npm run build` and report outputs.