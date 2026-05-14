import { useState, useEffect, useMemo } from "react";
import { Employee, Group, Holiday, Regime } from "@/lib/types/types";
import { getHolidaysForYear } from "@/features/management/utils/holidays";
import { generateSchedule } from "@/features/schedule/utils/schedule-generator";
import { useLanguage } from "@/lib/contexts/language-context";
import { getScheduleData } from "@/lib/api/client";

export function useSchedule(enabled = true) {
    const { language } = useLanguage();

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [regime, setRegime] = useState<Regime>("business_days");
    const [startingGroupId, setStartingGroupId] = useState<string | undefined>();

    const [groups, setGroups] = useState<Group[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const savedMonth = localStorage.getItem('schedule_month');
        const savedYear = localStorage.getItem('schedule_year');
        const savedRegime = localStorage.getItem('schedule_regime');
        const savedStartId = localStorage.getItem('schedule_start_id');

        if (savedMonth) setMonth(Number(savedMonth));
        if (savedYear) setYear(Number(savedYear));
        if (savedRegime) setRegime(savedRegime as Regime);
        if (savedStartId) setStartingGroupId(savedStartId);
    }, []);

    useEffect(() => {
        if (!isInitialLoad) {
            localStorage.setItem('schedule_month', month.toString());
            localStorage.setItem('schedule_year', year.toString());
            localStorage.setItem('schedule_regime', regime);
            if (startingGroupId) localStorage.setItem('schedule_start_id', startingGroupId);
        }
    }, [month, year, regime, startingGroupId, isInitialLoad]);

    useEffect(() => {
        if (!enabled) {
            setIsInitialLoad(false);
            return;
        }

        async function fetchData() {
            setIsInitialLoad(true);

            try {
                const data = await getScheduleData();

                setGroups(data.groups);
                if (data.groups.length > 0 && !localStorage.getItem('schedule_start_id')) {
                    setStartingGroupId(data.groups[0].id);
                }

                setEmployees(data.employees);
                setCustomHolidays(data.holidays);

            } catch (error) {
                console.error("Erro ao buscar dados da API:", error);
            } finally {
                setIsInitialLoad(false);
            }
        }

        fetchData();
    }, [enabled]);

    useEffect(() => {
        const national = getHolidaysForYear(year, language);
        setHolidays([...national, ...customHolidays]);
    }, [year, language, customHolidays]);
    const schedule = useMemo(() => {
        let actualStartId = startingGroupId;
        if (!actualStartId && groups.length > 0) actualStartId = groups[0].id;

        const rawSchedule = generateSchedule({
            month,
            year,
            regime,
            groups,
            holidays,
            startingGroupId: actualStartId
        });

        return rawSchedule.map(day => {
            if (!day.group) return day;

            const groupEmployees = employees.filter(e => e.groupId === day.group!.id);

            return { ...day, employees: groupEmployees };
        });
    }, [month, year, regime, groups, employees, holidays, startingGroupId]);

    return {
        state: { month, year, regime, groups, employees, holidays, customHolidays, startingGroupId, isLoading: isInitialLoad },
        setters: { setMonth, setYear, setRegime, setGroups, setEmployees, setHolidays, setCustomHolidays, setStartingGroupId },
        schedule
    };
}
