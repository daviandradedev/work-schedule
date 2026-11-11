import { useState, useEffect, useMemo } from "react";
import { Employee, Group, Holiday, Regime } from "@/lib/types/types";
import { getHolidaysForYear } from "@/features/management/utils/holidays";
import { generateSchedule } from "@/features/schedule/utils/schedule-generator";
import { useLanguage } from "@/lib/contexts/language-context";
import { getScheduleData } from "@/lib/api/client";

export function useSchedule(signedIn = false, sessionPending = false) {
    const { language } = useLanguage();

    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [regime, setRegime] = useState<Regime>("business_days");
    const [startingGroupId, setStartingGroupId] = useState<string | undefined>();

    const [groups, setGroups] = useState<Group[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [customHolidays, setCustomHolidays] = useState<Holiday[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [generated, setGenerated] = useState(false);

    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (sessionPending) return;
        if (!signedIn) {
            setIsInitialLoad(false);
            return;
        }

        let cancelled = false;

        async function fetchData() {
            setIsInitialLoad(true);

            try {
                const data = await getScheduleData();
                if (cancelled) return;

                setGroups(data.groups);
                setEmployees(data.employees);
                setCustomHolidays(data.holidays);
                setStartingGroupId((current) =>
                    current && data.groups.some((group) => group.id === current)
                        ? current
                        : data.groups[0]?.id,
                );
                setGenerated(data.groups.length > 0);
            } catch (error) {
                console.error("Failed to load schedule", error);
            } finally {
                if (!cancelled) setIsInitialLoad(false);
            }
        }

        void fetchData();
        return () => {
            cancelled = true;
        };
    }, [signedIn, sessionPending]);

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
        state: {
            month,
            year,
            regime,
            groups,
            employees,
            holidays,
            customHolidays,
            startingGroupId,
            isLoading: isInitialLoad,
            signedIn,
            generated,
        },
        setters: {
            setMonth,
            setYear,
            setRegime,
            setGroups,
            setEmployees,
            setHolidays,
            setCustomHolidays,
            setStartingGroupId,
            setGenerated,
        },
        schedule
    };
}
