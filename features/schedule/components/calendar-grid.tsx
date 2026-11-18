import { format, getDay } from "date-fns";
import { enUS, ptBR } from "date-fns/locale";
import { CalendarIcon, Download, Users } from "lucide-react";
import { ScheduleDay } from "@/lib/types/types";
import { useLanguage } from "@/lib/contexts/language-context";
import { exportToPdf } from "@/features/schedule/utils/export-pdf";
import { CalendarDayItem } from "./calendar-day-item";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";

interface CalendarGridProps {
  schedule: ScheduleDay[];
  state: any;
  legendData: any[];
  setIsLegendOpen: (val: boolean) => void;
}

export function CalendarGrid({ schedule, state, legendData, setIsLegendOpen }: CalendarGridProps) {
  const { language, t } = useLanguage();
  const dateLocale = language === 'pt' ? ptBR : enUS;

  const rawWeekdays = t('calendar.weekdays') as string[];
  const weekdays = [...rawWeekdays.slice(1), rawWeekdays[0]];

  const firstDay = new Date(state.year, state.month - 1, 1);
  const startingDayIndex = (getDay(firstDay) + 6) % 7;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative z-10">
      <div className="flex-1 overflow-y-auto p-3 md:p-6 2xl:p-8 custom-scrollbar">
        <div className="flex justify-between items-start md:items-center gap-4 mb-6 md:mb-8 sticky top-0 z-20 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md pb-4 pt-2 -mt-2 -mx-2 px-2 md:-mx-4 md:px-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter dark:text-white uppercase">
              {format(firstDay, "MMMM yyyy", { locale: dateLocale })}
            </h1>
            <p className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
              <CalendarIcon size={14} /> {t('calendar.officialSchedule')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => exportToPdf(schedule, state.month, state.year, language, t)} className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md transform hover:scale-105 transition-all outline-none border-none">
              <Download size={16} /> <span className="hidden md:inline">Download PDF</span>
            </Button>

            {legendData.length > 0 && (
              <button onClick={() => setIsLegendOpen(true)} className="flex 2xl:hidden items-center justify-center p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl shadow-sm hover:scale-105 transition-all">
                <Users size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 2xl:gap-3">
          {weekdays.map((day: string) => (
            <div key={day} className="text-center text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest pb-2">
              <span className="hidden lg:inline">{day}</span>
              <span className="lg:hidden">{day.substring(0, 3)}</span>
            </div>
          ))}

          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`prev-${i}`} className="min-h-[65px] md:min-h-[100px] 2xl:min-h-[120px] rounded-xl 2xl:rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/10 flex items-center justify-center"></div>
          ))}

          {schedule.map((day) => (
            <CalendarDayItem key={day.date.toISOString()} day={day} t={t} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
