"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { translations, type Language } from "../translations";
import { browserLanguage, persistLanguage, storedLanguage } from "../preferences";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const synced = useRef(false);
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? "pt");
  const [locked, setLocked] = useState(initialLanguage != null);

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  }, [language]);

  useEffect(() => {
    if (locked || synced.current) return;
    synced.current = true;
    const stored = storedLanguage();
    const next = stored ?? browserLanguage();
    const baseline = initialLanguage ?? "pt";
    if (!stored && next === baseline) return;
    persistLanguage(next);
    setLanguageState(next);
    setLocked(true);
    if (next !== baseline) router.refresh();
  }, [initialLanguage, locked, router]);

  const setLanguage = (lang: Language) => {
    setLocked(true);
    setLanguageState(lang);
    persistLanguage(lang);
    router.refresh();
  };

  const t = (path: string) => {
    const value = path.split(".").reduce<any>((obj, key) => obj?.[key], translations[language]);
    return value ?? path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
