import path from "node:path";

/**
 * Authenticated Playwright storage state is written per browser so every
 * project restores cookies created by the browser that runs it. Replaying a
 * Chromium-written state into WebKit is not guaranteed to authenticate.
 */
export const authenticatedStatePath = (browserName: string): string =>
  path.resolve(__dirname, "../playwright/.auth", `${browserName}.json`);
