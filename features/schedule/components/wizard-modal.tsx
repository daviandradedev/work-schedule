import { Settings2, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { cn } from "@/lib/utils";
import { ConfigTab } from "@/features/management/components/config-tab";
import { TeamsTab } from "@/features/teams/components/teams-tab";

interface WizardModalProps {
    state: any;
    setters: any;
    setIsWizardOpen: (val: boolean) => void;
    handleGenerate: () => void;
    theme?: string;
    toggleTheme?: () => void;
}

export function WizardModal({ state, setters, setIsWizardOpen, handleGenerate, theme, toggleTheme }: WizardModalProps) {
    const { language, setLanguage, t } = useLanguage();

    const hasEmptyTeams = state.groups?.length > 0 && state.groups.some((g: any) => 
        !state.employees?.some((e: any) => e.groupId === g.id)
    );
    const isGenerateDisabled = !state.groups || state.groups.length === 0 || hasEmptyTeams;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-lg flex items-center gap-2 dark:text-white">
                        <Settings2 className="text-blue-500" /> {t('wizard.title')}
                    </h3>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')} className="relative flex items-center w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full p-0.5 cursor-pointer transition-colors shrink-0">
                                <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", language === 'pt' ? "translate-x-6" : "translate-x-0")} />
                                <div className="relative z-10 flex justify-between w-full px-0.5">
                                    <span className="text-[10px] leading-none select-none">🇺🇸</span>
                                    <span className="text-[10px] leading-none select-none">🇧🇷</span>
                                </div>
                            </button>
                            <button onClick={toggleTheme} className="relative flex items-center w-12 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full p-0.5 cursor-pointer transition-colors shrink-0">
                                <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-zinc-700 rounded-full shadow-sm transition-transform duration-300 ease-in-out", theme === 'dark' ? "translate-x-6" : "translate-x-0")} />
                                <div className="relative z-10 flex justify-between items-center w-full px-1">
                                    <Sun size={10} className={theme === 'dark' ? 'text-zinc-500' : 'text-amber-500'} />
                                    <Moon size={10} className={theme === 'light' ? 'text-zinc-400' : 'text-blue-400'} />
                                </div>
                            </button>
                        </div>
                        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />
                        <button onClick={() => setIsWizardOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                    <TeamsTab state={state} setters={setters} />
                    <hr className="border-zinc-100 dark:border-zinc-800" />
                    <ConfigTab state={state} setters={setters} />
                </div>

                <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3 shrink-0">
                    <Button variant="outline" onClick={() => setIsWizardOpen(false)}>{t('wizard.cancel')}</Button>
                    <Button onClick={handleGenerate} disabled={isGenerateDisabled}>
                        {t('wizard.generate')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
