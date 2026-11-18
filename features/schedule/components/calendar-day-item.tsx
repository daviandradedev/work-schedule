import { motion } from "framer-motion";
import { format } from "date-fns";
import { ScheduleDay } from "@/lib/types/types";
import { cn } from "@/lib/utils";

interface CalendarDayItemProps {
    day: ScheduleDay;
    t: (path: string) => string;
}

export function CalendarDayItem({ day, t }: CalendarDayItemProps) {
    return (
        <motion.div
            className={cn(
                "min-h-[65px] md:min-h-[100px] 2xl:min-h-[120px] p-1.5 md:p-2 2xl:p-4 rounded-xl 2xl:rounded-2xl border transition-all flex flex-col items-center justify-center 2xl:items-start 2xl:justify-start group overflow-hidden",
                day.isWeekend || day.isHoliday
                    ? "border-zinc-100 dark:border-zinc-800/50"
                    : "border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl",
                day.group && !day.isHoliday && "border-b-[3px] 2xl:border-b-4"
            )}
            style={{
                backgroundColor: day.group && !day.isHoliday ? `${day.group.color}15` : undefined,
                borderBottomColor: day.group && !day.isHoliday ? day.group.color : undefined,
            }}
        >
            <div className="flex w-full flex-col 2xl:flex-row justify-center 2xl:justify-between items-center 2xl:items-start gap-0.5 2xl:gap-0">
                <span className={cn(
                    "text-base md:text-lg 2xl:text-xl font-black",
                    day.isHoliday
                        ? "text-red-500 dark:text-red-400"
                        : day.isWeekend
                            ? "text-zinc-300 dark:text-zinc-600"
                            : "text-zinc-800 dark:text-zinc-200"
                )}>
                    {format(day.date, "dd")}
                </span>

                {day.isHoliday && (
                    <span className="hidden md:inline-block bg-red-500 text-[6px] xl:text-[8px] text-white px-1.5 py-0.5 rounded-full font-black uppercase text-center max-w-[90%] truncate" title={day.holidayName}>
                        {day.holidayTag || t('calendar.holiday')}
                    </span>
                )}
            </div>

            <div className="mt-1 2xl:mt-auto flex w-full justify-center 2xl:justify-start overflow-hidden">
                {day.group ? (
                    <div className="flex flex-col 2xl:flex-row items-center gap-1 2xl:gap-2 w-full min-w-0">
                        <div className="w-2.5 h-2.5 2xl:w-3 2xl:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: day.group.color }} />
                        <span
                            className="hidden md:inline text-[8px] xl:text-[10px] font-black uppercase truncate text-center 2xl:text-left min-w-0 w-full"
                            style={{ color: day.group.color }}
                            title={day.group.name}
                        >
                            {day.group.name}
                        </span>
                    </div>
                ) : (
                    <span className="hidden md:block text-[8px] xl:text-[10px] text-zinc-400 italic font-medium text-center 2xl:text-left truncate w-full min-w-0" title={day.isHoliday ? day.holidayName : day.isWeekend ? t('calendar.offDuty') : t('calendar.unassigned')}>
                        {day.isHoliday ? day.holidayName : day.isWeekend ? t('calendar.offDuty') : t('calendar.unassigned')}
                    </span>
                )}
            </div>
        </motion.div>
    );
}
