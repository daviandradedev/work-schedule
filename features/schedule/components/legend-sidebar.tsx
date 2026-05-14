import { Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/contexts/language-context";

interface LegendSidebarProps {
    legendData: any[];
    isLegendOpen: boolean;
    setIsLegendOpen: (val: boolean) => void;
}

export function LegendSidebar({ legendData, isLegendOpen, setIsLegendOpen }: LegendSidebarProps) {
    const { t } = useLanguage();

    if (legendData.length === 0) return null;

    return (
        <>
            {isLegendOpen && (
                <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm 2xl:hidden transition-opacity" onClick={() => setIsLegendOpen(false)} />
            )}

            <div className={cn(
                "fixed inset-y-0 right-0 z-50 w-[85vw] sm:w-80 xl:w-64 2xl:w-72 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-200 dark:border-zinc-800 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 transform transition-transform duration-300 ease-in-out 2xl:relative 2xl:translate-x-0 shadow-2xl 2xl:shadow-none",
                isLegendOpen ? "translate-x-0" : "translate-x-full"
            )}>
                <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                        <Users size={14} /> {t('tabs.teams')}
                    </h3>
                    <button onClick={() => setIsLegendOpen(false)} className="2xl:hidden p-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-6">
                    {legendData.map((data: any) => (
                        <div key={data.group.id} className="space-y-3">
                            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800/50 pb-2">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: data.group.color }} />
                                <span className="text-sm font-black uppercase" style={{ color: data.group.color }}>{data.group.name}</span>
                            </div>

                            <div className="flex flex-col gap-1 pl-5 border-l-2 border-zinc-100 dark:border-zinc-800 ml-1.5">
                                {data.employees.map((e: any) => (
                                    <span key={e.id} className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">
                                        {e.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
