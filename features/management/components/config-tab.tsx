import { format } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { CalendarDays, Briefcase, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/contexts/language-context";
import { Select } from "@/components/ui/select";

export function ConfigTab({ state, setters }: any) {
    const { language, t } = useLanguage();
    const dateLocale = language === 'pt' ? ptBR : enUS;

    const safeGroups = state?.groups || [];
    const hasYearError = !state.year || state.year < 2000;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <CalendarDays size={12} /> {t('config.period')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <div className="w-full sm:flex-1">
                        <Select value={state.month} onChange={(e) => setters.setMonth(Number(e.target.value))} className="w-full text-zinc-900 dark:text-zinc-100">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {format(new Date(2020, i, 1), "MMMM", { locale: dateLocale })}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <input
                        type="number"
                        value={state.year || ""}
                        onChange={(e) => setters.setYear(Number(e.target.value))}
                        className={cn(
                            "w-full sm:w-28 bg-white dark:bg-zinc-950 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 transition-all text-zinc-900 dark:text-zinc-100",
                            hasYearError
                                ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                        )}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Users size={12} /> {t('config.startingTeam')}
                </label>
                <Select value={state.startingGroupId || ""} onChange={(e) => setters.setStartingGroupId(e.target.value)} disabled={safeGroups.length === 0} className="w-full text-zinc-900 dark:text-zinc-100">
                    <option value="" disabled hidden>{t('config.selectTeam')}</option>
                    {safeGroups.map((g: any) => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={12} /> {t('config.regime')}
                </label>
                <div className="flex flex-col gap-2">
                    {[
                        { id: 'business_days', label: t('config.regimes.business_days') },
                        { id: 'mon_to_sat', label: t('config.regimes.mon_to_sat') },
                        { id: 'seven_by_seven', label: t('config.regimes.seven_by_seven') }
                    ].map((r) => (
                        <button key={r.id} onClick={() => setters.setRegime(r.id as any)} className={cn("text-left px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold border transition-all", state.regime === r.id ? "bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300")}>{r.label}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}
