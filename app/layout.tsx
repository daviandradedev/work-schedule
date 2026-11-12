import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/contexts/language-context";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { readLanguageCookie, readThemeCookie } from "@/lib/preferences";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Gerador de Escala de Trabalho",
  description: "Crie, gerencie e exporte escalas de trabalho mensais facilmente.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = readThemeCookie(cookieStore.get("theme")?.value);
  const language = readLanguageCookie(cookieStore.get("language")?.value);

  return (
    <html
      lang={language === "en" ? "en" : "pt-BR"}
      className={`${geistSans.variable} ${geistMono.variable}${theme === "light" ? "" : " dark"}`}
      style={{ colorScheme: theme === "light" ? "light" : "dark" }}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider initialTheme={theme}>
          <LanguageProvider initialLanguage={language}>
            {children}
            <Toaster position="top-right" richColors />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
