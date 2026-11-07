"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Monitor, Sun } from "lucide-react";
import type { ThemeMode } from "@/lib/theme";
import {
  applyTheme,
  readStoredTheme,
  storeTheme,
} from "@/lib/theme";

const modes: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light", Icon: Sun },
  { mode: "dark", label: "Dark", Icon: Moon },
  { mode: "auto", label: "Auto", Icon: Monitor },
];

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener("biasly-theme-change", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("biasly-theme-change", handler);
  };
}

function clientSnapshot(): ThemeMode {
  return readStoredTheme();
}

function serverSnapshot(): ThemeMode {
  return "auto";
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (readStoredTheme() === "auto") applyTheme("auto");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  function select(next: ThemeMode) {
    storeTheme(next);
    window.dispatchEvent(new Event("biasly-theme-change"));
    applyTheme(next);
  }

  return (
    <div
      data-testid="theme-toggle"
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-secondary p-1"
    >
      {modes.map(({ mode: m, label, Icon }) => (
        <button
          key={m}
          type="button"
          onClick={() => select(m)}
          aria-pressed={mode === m}
          aria-label={label}
          className={
            "flex h-7 w-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary " +
            (mode === m
              ? "bg-bg-primary text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary")
          }
        >
          <Icon size={14} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
