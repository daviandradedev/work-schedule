"use client";

import { useLanguage } from "@/lib/contexts/language-context";

export function SkipLink() {
  const { t } = useLanguage();

  return (
    <a href="#main-content" className="skip-link">
      {t("skipToContent")}
    </a>
  );
}
