"use client";

import { useMemo, useState } from "react";
import { ScheduleDay } from "@/lib/types/types";
import { useEscapeKey } from "@/lib/hooks/use-escape-key";
import { WelcomeScreen } from "./welcome-screen";
import { WizardModal } from "./wizard-modal";
import { CalendarGrid } from "./calendar-grid";
import { LegendSidebar } from "./legend-sidebar";

interface CalendarProps {
    schedule: ScheduleDay[];
    state?: any;
    setters?: any;
    isGenerated: boolean;
    setIsGenerated: (v: boolean) => void;
    theme?: string;
    toggleTheme?: () => void;
}

export function Calendar({ schedule, state, setters, isGenerated, setIsGenerated, theme, toggleTheme }: CalendarProps) {
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    useEscapeKey(() => setIsLegendOpen(false), isLegendOpen);

    const legendData = useMemo(() => {
        if (!schedule?.length) return [];
        const map = new Map();
        schedule.forEach(day => {
            if (day.group && day.employees) {
                if (!map.has(day.group.id)) {
                    map.set(day.group.id, {
                        group: day.group,
                        employees: day.employees
                    });
                }
            }
        });
        return Array.from(map.values());
    }, [schedule]);

    const handleGenerate = () => {
        setIsWizardOpen(false);
        setIsGenerated(true);
    };

    if (!isGenerated && state && setters) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 h-full p-4">
                <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-0" />

                <WelcomeScreen setIsWizardOpen={setIsWizardOpen} theme={theme} toggleTheme={toggleTheme} />

                {isWizardOpen && (
                    <WizardModal
                        state={state}
                        setters={setters}
                        setIsWizardOpen={setIsWizardOpen}
                        handleGenerate={handleGenerate}
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                )}
            </div>
        );
    }

    if (!schedule?.length) return null;

    return (
        <div className="flex h-full w-full overflow-hidden relative">
            <CalendarGrid
                schedule={schedule}
                state={state}
                legendData={legendData}
                setIsLegendOpen={setIsLegendOpen}
            />
            <LegendSidebar
                legendData={legendData}
                isLegendOpen={isLegendOpen}
                setIsLegendOpen={setIsLegendOpen}
            />
        </div>
    );
}
