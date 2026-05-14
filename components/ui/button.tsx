import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
    const variants = {
        primary: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90",
        secondary: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700",
        danger: "text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30",
        outline: "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400",
        ghost: "bg-transparent text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800",
    };

    return (
        <button
            className={cn(
                "h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
