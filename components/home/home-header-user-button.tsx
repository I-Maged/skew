"use client";

import { useEffect, useState } from "react";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";

export function HomeHeaderUserButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="flex h-9 w-8 items-center justify-center">
      {mounted ? (
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      ) : null}
    </div>
  );
}
