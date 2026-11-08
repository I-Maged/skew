# Clerk Authentication

## Goal

Add Clerk authentication to the existing Next.js 16 `biasly` application. Keep the homepage public, make article/news detail pages protected, and expose Clerk auth controls in the site header.

## Skills read

- `.agents/skills/clerk-setup`
- `.agents/skills/clerk-nextjs-patterns`
- Node.js Next.js documentation: `proxy.ts`, `middleware` deprecation, Cache Components

## Existing code inspected

- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/news/[slug]/page.tsx`
- `components/home/home-header.tsx`
- `.env.local`
- `next.config.ts` (`cacheComponents: true`, `partialPrefetching: true`)

## Decisions or assumptions

- Manual Clerk setup is used because Clerk environment keys already exist in `.env.local`.
- Next.js 16 requires `proxy.ts`, not `middleware.ts`.
- `ClerkProvider` goes inside `<body>`, not around `<html>`.
- Auth controls are wrapped in `<Suspense>` because `cacheComponents` is enabled.
- Public routes are `/`, `/sign-in(.*)`, and `/sign-up(.*)`.
- Protected routes are `/news(.*)`.
- The existing signed-out Login button appearance is preserved by wrapping it with `SignInButton mode="modal"`.
- No application API routes are protected by this change; admin/action routes continue to use `BIASLY_ADMIN_SECRET`.

## Files likely to change

- `package.json`
- `proxy.ts`
- `app/layout.tsx`
- `components/home/home-header.tsx`
- `app/sign-in/[[...sign-in]]/page.tsx`
- `app/sign-up/[[...sign-up]]/page.tsx`
- `.env.local`
- `.env.example`

## Implementation requirements

1. Install and use `@clerk/nextjs`.
2. Create `proxy.ts` at the project root with `clerkMiddleware`, public route matcher, and `auth.protect()` for protected routes.
3. Wrap app children in `ClerkProvider` inside `<body>`.
4. Update the header to conditionally show auth controls:
   - signed out: modal `SignInButton` wrapping the existing Login button styling
   - signed in: `UserButton`
   - wrap Clerk components in `<Suspense>`
5. Add catch-all sign-in and sign-up pages with `<Suspense>` wrappers.
6. Add Clerk route environment variables.
7. Create `.env.example` with placeholders.
8. Do not expose secrets to browser code.

## Security requirements

- `CLERK_SECRET_KEY` remains server-only.
- Only `NEXT_PUBLIC_*` Clerk values may reach browser code.
- `proxy.ts` protection must not expose protected page content before redirect.
- No Oxylabs, OpenAI, Supabase service role, or admin secrets are added or changed by this task.

## Acceptance criteria

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run build` passes.
- `/` is public.
- `/news/[slug]` requires authentication.
- Header shows Login when signed out and user avatar/menu when signed in.
- Sign-in and sign-up routes render without runtime errors.

## Checks to run

- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Exact manual test steps expected after implementation

1. Run `npm run dev`.
2. Open `/` and verify the homepage loads while signed out.
3. Open `/news/anything` and verify redirect to `/sign-in`.
4. Click Login and complete Clerk sign-in.
5. Reopen `/` and verify the header shows the user button.
6. Reopen `/news/anything` and verify the detail page renders.