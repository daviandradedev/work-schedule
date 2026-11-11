"use client";

import { useState } from "react";
import { useSchedule } from "@/features/schedule/hooks/use-schedule";
import { useTheme } from "@/lib/hooks/use-theme";
import { Sidebar } from "@/features/management/components/sidebar";
import { useLanguage } from "@/lib/contexts/language-context";
import { Calendar } from "@/features/schedule/components/calendar";
import { WelcomeScreen } from "@/features/schedule/components/welcome-screen";
import { WizardModal } from "@/features/schedule/components/wizard-modal";
import { GuestSessionModal } from "@/components/guest-session-modal";
import { SessionKeepAlive } from "@/components/session-keep-alive";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const signedIn = Boolean(session);
  const { state, setters, schedule } = useSchedule(signedIn, isSessionPending);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  if (isSessionPending || state.isLoading) {
    return (
      <div className="h-[100dvh] w-full bg-white dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse">{t("loading")}</p>
      </div>
    );
  }

  return (
    <>
      {signedIn ? <SessionKeepAlive /> : <GuestSessionModal />}
      {state.generated ? (
        <div className="flex flex-col md:flex-row h-[100dvh] bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
          <Sidebar state={state} setters={setters} theme={theme} toggleTheme={toggleTheme} />
          <main className="flex-1 relative overflow-hidden bg-[url('/noise.png')]">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 w-full h-full">
              <Calendar
                schedule={schedule}
                state={state}
                setters={setters}
                isGenerated={state.generated}
                setIsGenerated={setters.setGenerated}
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </div>
          </main>
        </div>
      ) : (
        <div className="relative h-[100dvh] w-full bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4 bg-[url('/noise.png')]">
          <WelcomeScreen
            setIsWizardOpen={setIsWizardOpen}
            theme={theme}
            toggleTheme={toggleTheme}
            signedIn={signedIn}
          />
          {isWizardOpen && (
            <WizardModal
              state={state}
              setters={setters}
              setIsWizardOpen={setIsWizardOpen}
              handleGenerate={() => {
                setters.setGenerated(true);
                setIsWizardOpen(false);
              }}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          )}
        </div>
      )}
    </>
  );
}
