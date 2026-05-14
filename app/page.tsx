"use client";

import { useState, useEffect } from "react";
import { useSchedule } from "@/features/schedule/hooks/use-schedule";
import { useTheme } from "@/lib/hooks/use-theme";
import { Sidebar } from "@/features/management/components/sidebar";
import { useLanguage } from "@/lib/contexts/language-context";
import { Calendar } from "@/features/schedule/components/calendar";
import { AuthForm } from "@/features/auth/components/auth-form";
import { WelcomeScreen } from "@/features/schedule/components/welcome-screen";
import { WizardModal } from "@/features/schedule/components/wizard-modal";
import { authClient } from "@/lib/auth-client";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Page() {
  const {
    data: session,
    isPending: isSessionPending,
  } = authClient.useSession();
  const { state, setters, schedule } = useSchedule(Boolean(session));
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();

  const [isGenerated, setIsGenerated] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!state.isLoading && session) {
      const hasGeneratedBefore = localStorage.getItem('schedule_generated') === 'true';
      if (hasGeneratedBefore && state.groups.length > 0) {
        setIsGenerated(true);
      }
      setIsChecking(false);
    }
  }, [state.isLoading, session, state.groups.length]);

  if (isSessionPending || state.isLoading || (session && isChecking)) {
    return (
      <div className="h-[100dvh] w-full bg-white dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">{t('loading')}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 bg-[url('/noise.png')] overflow-hidden">

        <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
          <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')} className="relative flex items-center w-14 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0 shadow-sm">
            <div className={cn("absolute top-1 left-1 w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", language === 'pt' ? "translate-x-6" : "translate-x-0")} />
            <div className="relative z-10 flex justify-between w-full px-0.5">
              <span className="text-sm leading-none select-none">🇺🇸</span>
              <span className="text-sm leading-none select-none">🇧🇷</span>
            </div>
          </button>

          <button onClick={toggleTheme} className="relative flex items-center w-14 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0 shadow-sm">
            <div className={cn("absolute top-1 left-1 w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", theme === 'dark' ? "translate-x-6" : "translate-x-0")} />
            <div className="relative z-10 flex justify-between items-center w-full px-1">
              <Sun size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-amber-500'} />
              <Moon size={14} className={theme === 'light' ? 'text-zinc-400' : 'text-blue-400'} />
            </div>
          </button>
        </div>

        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <AuthForm />
      </div>
    );
  }

  if (!isGenerated) {
    return (
      <div className="relative h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 bg-[url('/noise.png')]">
        <WelcomeScreen
          setIsWizardOpen={setIsWizardOpen}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        {isWizardOpen && (
          <WizardModal
            state={state}
            setters={setters}
            setIsWizardOpen={setIsWizardOpen}
            handleGenerate={() => {
              setIsGenerated(true);
              setIsWizardOpen(false);
              localStorage.setItem('schedule_generated', 'true');
            }}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      <Sidebar state={state} setters={setters} theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-1 relative overflow-hidden bg-[url('/noise.png')]">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 w-full h-full">
          <Calendar
            schedule={schedule}
            state={state}
            setters={setters}
            isGenerated={isGenerated}
            setIsGenerated={(val) => {
              setIsGenerated(val);
              if (val) localStorage.setItem('schedule_generated', 'true');
            }}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      </main>
    </div>
  );
}
