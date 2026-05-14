import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { CalendarIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function AuthForm() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        if (isSignUp) {
            const { error } = await authClient.signUp.email({
                email,
                password,
                name: email.split("@")[0] || email,
            });

            if (error) {
                const errorStr = error.message?.toLowerCase() ?? "";
                if (errorStr.includes("already") || errorStr.includes("exists")) {
                    setErrorMsg(t("auth.emailExistsMsg"));
                } else if (errorStr.includes("password")) {
                    setErrorMsg(t("auth.weakPasswordMsg"));
                } else {
                    setErrorMsg(error.message || t("messages.cloudError"));
                }
            }
            else {
                toast.success(t("auth.successMsg"));
                setIsSignUp(false);
                setPassword("");
            }
        } else {
            const { error } = await authClient.signIn.email({ email, password });
            if (error) setErrorMsg(t("auth.wrongCredentialsMsg"));
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-sm p-8 bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-2">
                    <CalendarIcon size={32} />
                </div>
                <h2 className="text-2xl font-black dark:text-white tracking-tight">
                    {isSignUp ? t("auth.createAccount") : t("auth.welcome")}
                </h2>
                <p className="text-sm text-zinc-500">
                    {isSignUp ? t("auth.signUpSubtitle") : t("auth.signInSubtitle")}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4" autoComplete="off">
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder={t("auth.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-sm"
                        required
                        autoComplete="off"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.passwordPlaceholder")}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-4 pr-12 py-3 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all text-sm"
                            required
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            title={showPassword ? "Ocultar senha" : "Ver senha"}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-medium text-center">{errorMsg}</p>}

                <Button className="w-full font-bold tracking-wide py-6" disabled={loading}>
                    {loading ? t("auth.loading") : isSignUp ? t("auth.signUpButton") : t("auth.signInButton")}
                </Button>
            </form>

            <div className="text-center">
                <button
                    type="button"
                    onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(""); }}
                    className="text-xs font-semibold text-zinc-400 hover:text-blue-500 transition-colors"
                >
                    {isSignUp ? t("auth.toggleToSignIn") : t("auth.toggleToSignUp")}
                </button>
            </div>
        </div>
    );
}
