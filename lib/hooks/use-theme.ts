"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
    const { theme, setTheme, resolvedTheme } = useNextTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    const toggleTheme = () => {
        setTheme(currentTheme === "light" ? "dark" : "light");
    };

    if (!mounted) {
        return { theme: "light", toggleTheme: () => { } };
    }

    return { theme: currentTheme, toggleTheme };
}
