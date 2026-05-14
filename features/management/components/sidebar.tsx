import { useState } from "react";
import { Settings, Sun, Moon, CalendarDays, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/language-context";
import { TeamsTab } from "@/features/teams/components/teams-tab";
import { HolidaysTab } from "./holidays-tab";
import { ConfigTab } from "./config-tab";
import { useEscapeKey } from "@/lib/hooks/use-escape-key";
import { authClient } from "@/lib/auth-client";

export function Sidebar({ state, setters, theme, toggleTheme }: any) {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"main" | "holidays">("main");
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const userEmail = session?.user.email ?? null;

  useEscapeKey(() => setIsOpen(false), isOpen);

  const handleLogout = async () => {
    const keysToRemove = [
      'schedule_month', 'schedule_year', 'schedule_regime',
      'schedule_start_id', 'schedule_generated'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    await authClient.signOut();
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 p-3.5 bg-blue-500 text-white rounded-full shadow-xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all"
        title={t('controlPanel')}
      >
        <Settings size={24} className="animate-spin-slow" style={{ animationDuration: '3s' }} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[85vw] sm:w-80 lg:w-72 xl:w-80 2xl:w-96 flex flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 h-[100dvh] transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none lg:relative lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 2xl:p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-lg 2xl:text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent truncate">
            <Settings className="w-5 h-5 flex-shrink-0 text-blue-500" /> {t('controlPanel')}
          </h2>
        </div>

        <div className="flex border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <button
            onClick={() => setActiveTab("main")}
            className={cn(
              "flex-1 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap",
              activeTab === "main" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-zinc-400 hover:text-zinc-600"
            )}
          >
            {t('sidebar.teamsAndSchedule')}
          </button>
          <button
            onClick={() => setActiveTab("holidays")}
            className={cn(
              "flex-1 px-3 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap",
              activeTab === "holidays" ? "border-blue-500 text-blue-600 dark:text-blue-400" : "border-transparent text-zinc-400 hover:text-zinc-600"
            )}
          >
            {t('tabs.holidays')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 2xl:p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === "main" && (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 pb-10">
                <section>
                  <TeamsTab state={state} setters={setters} />
                </section>
                <hr className="border-zinc-100 dark:border-zinc-800" />
                <section>
                  <ConfigTab state={state} setters={setters} />
                </section>
              </motion.div>
            )}

            {activeTab === "holidays" && (
              <motion.div key="holidays" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HolidaysTab state={state} setters={setters} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-4 shrink-0 bg-white dark:bg-zinc-950">
          {userEmail && (
            <div className="flex items-center gap-3 px-3 py-2 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  {t('sidebar.loggedInAs')}
                </span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate" title={userEmail}>
                  {userEmail}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden flex items-center gap-2 h-9 px-4 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors shadow-sm"
            >
              <CalendarDays size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {t('sidebar.calendar')}
              </span>
            </button>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                className="relative flex items-center w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0"
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 w-6 h-6 bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out",
                    language === 'pt' ? "translate-x-6" : "translate-x-0"
                  )}
                />
                <div className="relative z-10 flex justify-between w-full px-0.5">
                  <span className="text-sm leading-none select-none">🇺🇸</span>
                  <span className="text-sm leading-none select-none">🇧🇷</span>
                </div>
              </button>

              <button
                onClick={toggleTheme}
                className="relative flex items-center w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0"
              >
                <div
                  className={cn(
                    "absolute top-1 left-1 w-6 h-6 bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out",
                    theme === 'dark' ? "translate-x-6" : "translate-x-0"
                  )}
                />
                <div className="relative z-10 flex justify-between items-center w-full px-1">
                  <Sun size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-amber-500'} />
                  <Moon size={14} className={theme === 'light' ? 'text-zinc-400' : 'text-blue-400'} />
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors text-xs font-bold uppercase tracking-widest mt-1"
          >
            <LogOut size={16} />
            {t('sidebar.logout')}
          </button>
        </div>
      </div>
    </>
  );
}
