import { eachDayOfInterval, endOfMonth, format, getDay } from "date-fns";
import { GenerateScheduleParams, ScheduleDay } from "@/lib/types/types";

export function generateSchedule({
  year,
  month,
  regime,
  startingGroupId,
  groups,
  holidays,
}: GenerateScheduleParams): ScheduleDay[] {
  const startDate = new Date(year, month - 1, 1);
  const endDate = endOfMonth(startDate);
  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });

  let groupIndex = 0;
  if (startingGroupId && groups.length > 0) {
    const idx = groups.findIndex((g) => g.id === startingGroupId);
    if (idx !== -1) groupIndex = idx;
  }

  return daysInMonth.map((date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const holidayMatch = holidays.find((h) => h.date === dateStr);
    const dayOfWeek = getDay(date);

    let isWorkDay = true;

    if (regime === "business_days") {
      isWorkDay = dayOfWeek !== 0 && dayOfWeek !== 6 && !holidayMatch;
    } else if (regime === "mon_to_sat") {
      isWorkDay = dayOfWeek !== 0 && !holidayMatch;
    } else if (regime === "seven_by_seven") {
      isWorkDay = true;
    }

    let assignedGroup = undefined;
    if (isWorkDay && groups.length > 0) {
      assignedGroup = groups[groupIndex];
      groupIndex = (groupIndex + 1) % groups.length;
    }

    return {
      date,
      isHoliday: !!holidayMatch,
      holidayName: holidayMatch?.name,
      holidayTag: holidayMatch?.tag,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isWorkDay,
      group: assignedGroup,
    };
  });
}
