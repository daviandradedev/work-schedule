import { CalendarIcon, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { redirectToAuthLogin } from "@/lib/auth-client";

export function SignInCard() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm p-8 bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-2">
          <CalendarIcon size={32} />
        </div>
        <h2 className="text-2xl font-black dark:text-white tracking-tight">{t("auth.welcome")}</h2>
        <p className="text-sm text-zinc-500">{t("auth.signInSubtitle")}</p>
      </div>

      <Button className="w-full font-bold tracking-wide py-6" onClick={redirectToAuthLogin}>
        <LogIn size={18} />
        {t("auth.signInButton")}
      </Button>
    </div>
  );
}
