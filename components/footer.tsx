"use client";

import { Mail } from "lucide-react";
import { useLanguage } from "@/lib/contexts/language-context";

export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    const footerText = `${t('footer.credit')} ${currentYear}`;

    return (
        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/50 mt-auto shrink-0">
            <div className="w-full px-3 md:px-6 2xl:px-8 py-4">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

                    <div className="hidden md:block"></div>

                    <p className="text-[10px] md:text-xs text-zinc-400 dark:text-zinc-500 font-medium text-center tracking-wide">
                        {footerText}
                    </p>

                    <div className="flex items-center justify-center md:justify-end gap-3.5">
                        <a
                            href="https://linkedin.com/in/daviandradedev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-blue-500 transition-all hover:scale-110 active:scale-95"
                            title="LinkedIn"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                            <span className="sr-only">LinkedIn</span>
                        </a>

                        <a
                            href="https://github.com/daviandradedev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all hover:scale-110 active:scale-95"
                            title="GitHub"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            <span className="sr-only">GitHub</span>
                        </a>

                        <a
                            href="mailto:daviandrade.dev@gmail.com"
                            className="text-zinc-400 hover:text-red-500 transition-all hover:scale-110 active:scale-95"
                            title="E-mail"
                        >
                            <Mail size={16} />
                            <span className="sr-only">E-mail</span>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
