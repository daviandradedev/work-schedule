"use client";

import { useSyncExternalStore } from "react";
import { redirectToAuthLogin } from "@/lib/login-redirect";
import { useLanguage } from "@/lib/contexts/language-context";

const DISMISS_KEY = "ws-explore-notice";
const DISMISS_EVENT = "ws-explore-notice";

function subscribeExploreNotice(onChange: () => void) {
  window.addEventListener(DISMISS_EVENT, onChange);
  return () => window.removeEventListener(DISMISS_EVENT, onChange);
}

export function ExplorePromptModal() {
  const { t } = useLanguage();
  const dismissed = useSyncExternalStore(
    subscribeExploreNotice,
    () => sessionStorage.getItem(DISMISS_KEY) === "1",
    () => true,
  );

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    window.dispatchEvent(new Event(DISMISS_EVENT));
  }

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="explore-prompt-title"
        className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
      >
        <p className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
          {t("explore.eyebrow")}
        </p>
        <h2 id="explore-prompt-title" className="mt-2 text-xl font-black">
          {t("explore.title")}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-300">{t("explore.body")}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={redirectToAuthLogin}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white hover:bg-blue-600"
          >
            {t("auth.signInButton")}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {t("explore.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
