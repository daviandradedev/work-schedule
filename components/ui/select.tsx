import { cn } from "@/lib/utils";
import { SelectHTMLAttributes } from "react";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn(
                "w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-3 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {children}
        </select>
    );
}
