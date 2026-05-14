import { CalendarIcon, Play, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface WelcomeScreenProps {
    setIsWizardOpen: (val: boolean) => void;
    theme?: string;
    toggleTheme?: () => void;
}

export function WelcomeScreen({ setIsWizardOpen, theme, toggleTheme }: WelcomeScreenProps) {
    const { language, setLanguage, t } = useLanguage();

    const handleLogout = async () => {
        const keysToRemove = [
            'schedule_month', 'schedule_year', 'schedule_regime',
            'schedule_start_id', 'schedule_generated', 'schedule_groups', 'schedule_employees'
        ];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        await authClient.signOut();
        window.location.reload();
    };

    return (
        <>
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                    onClick={handleLogout}
                    title={t("sidebar.logout")}
                    className="relative flex items-center justify-center w-8 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full cursor-pointer transition-colors shrink-0 shadow-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                    <LogOut size={14} />
                </button>
                <button
                    onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
                    className="relative flex items-center w-14 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0 shadow-sm"
                >
                    <div className={cn("absolute top-1 left-1 w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", language === 'pt' ? "translate-x-6" : "translate-x-0")} />
                    <div className="relative z-10 flex justify-between w-full px-0.5">
                        <span className="text-sm leading-none select-none">🇺🇸</span>
                        <span className="text-sm leading-none select-none">🇧🇷</span>
                    </div>
                </button>

                <button
                    onClick={toggleTheme}
                    className="relative flex items-center w-14 h-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full p-1 cursor-pointer transition-colors shrink-0 shadow-sm"
                >
                    <div className={cn("absolute top-1 left-1 w-6 h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", theme === 'dark' ? "translate-x-6" : "translate-x-0")} />
                    <div className="relative z-10 flex justify-between items-center w-full px-1">
                        <Sun size={14} className={theme === 'dark' ? 'text-zinc-500' : 'text-amber-500'} />
                        <Moon size={14} className={theme === 'light' ? 'text-zinc-400' : 'text-blue-400'} />
                    </div>
                </button>
            </div>

            <div className="relative z-10 text-center space-y-6 max-w-md w-full">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <CalendarIcon size={40} />
                </div>
                <h2 className="text-3xl font-black tracking-tight dark:text-white">
                    {t('welcome.title')}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    {t('welcome.subtitle')}
                </p>
                <Button onClick={() => setIsWizardOpen(true)} className="w-full text-sm uppercase tracking-widest font-black py-6">
                    <Play size={16} className="mr-2" /> {t('welcome.start')}
                </Button>
            </div>
        </>
    );
}
