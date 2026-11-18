"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { browserTheme, persistTheme, storedTheme, type Theme } from "@/lib/preferences";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function paintTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme | null;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? "dark");
  const [locked, setLocked] = useState(initialTheme != null);

  useEffect(() => {
    paintTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (locked) return;
    const stored = storedTheme();
    if (stored) {
      setLocked(true);
      setTheme(stored);
      persistTheme(stored);
      return;
    }
    const apply = () => setTheme(browserTheme());
    apply();
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [locked]);

  const toggleTheme = () => {
    setLocked(true);
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      persistTheme(next);
      paintTheme(next);
      return next;
    });
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
