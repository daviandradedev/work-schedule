import { useState } from "react";
import { Plus, Trash2, Tag, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/contexts/language-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createHoliday, deleteHoliday, updateHoliday } from "@/lib/api/client";
import { Holiday } from "@/lib/types/types";

export function HolidaysTab({ state, setters }: any) {
    const { t, language } = useLanguage();

    const [newHolName, setNewHolName] = useState("");
    const [newHolDate, setNewHolDate] = useState("");
    const [newHolTag, setNewHolTag] = useState("");
    const [addErrors, setAddErrors] = useState({ name: false, date: false });

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editHolName, setEditHolName] = useState("");
    const [editHolDate, setEditHolDate] = useState("");
    const [editHolTag, setEditHolTag] = useState("");
    const [editErrors, setEditErrors] = useState({ name: false, date: false });

    const handleAddHoliday = async () => {
        const hasErrorName = !newHolName.trim();
        const hasErrorDate = !newHolDate;

        if (hasErrorName || hasErrorDate) {
            setAddErrors({ name: hasErrorName, date: hasErrorDate });
            if (hasErrorName) {
                toast.error(t('holidays.nameRequired'), { position: 'top-left' });
            } else if (hasErrorDate) {
                toast.error(t('holidays.dateRequired'), { position: 'top-left' });
            }
            return;
        }

        const defaultTag = t('calendar.holiday');
        const finalTag = newHolTag.trim() ? newHolTag.trim().toUpperCase() : defaultTag;

        try {
            const newHol = await createHoliday({
                name: newHolName,
                date: newHolDate,
                tag: finalTag,
            });

            setters.setCustomHolidays?.([...(state.customHolidays || []), newHol]);
            setters.setHolidays([...state.holidays, newHol]);
            setNewHolName("");
            setNewHolDate("");
            setNewHolTag("");
            setAddErrors({ name: false, date: false });
        } catch (error) {
            console.error("ERRO DA API:", error);
            toast.error(t('messages.cloudError'), { position: 'top-left' });
        }
    };

    const removeItem = async (id: string) => {
        setters.setHolidays(state.holidays.filter((h: any) => h.id !== id));
        setters.setCustomHolidays?.((state.customHolidays || []).filter((h: Holiday) => h.id !== id));
        try {
            await deleteHoliday(id);
        } catch (error) {
            console.error(error);
            toast.error(t('messages.deleteError'), { position: 'top-left' });
        }
    };

    const startEditing = (h: any) => {
        setEditingId(h.id);
        setEditHolName(h.name);
        setEditHolDate(h.date);
        setEditHolTag(h.tag || "");
        setEditErrors({ name: false, date: false });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditHolName("");
        setEditHolDate("");
        setEditHolTag("");
        setEditErrors({ name: false, date: false });
    };

    const saveEdit = async (id: string) => {
        const hasErrorName = !editHolName.trim();
        const hasErrorDate = !editHolDate;

        if (hasErrorName || hasErrorDate) {
            setEditErrors({ name: hasErrorName, date: hasErrorDate });
            if (hasErrorName) {
                toast.error(t('holidays.nameRequired'), { position: 'top-left' });
            } else if (hasErrorDate) {
                toast.error(t('holidays.dateRequired'), { position: 'top-left' });
            }
            return;
        }

        const defaultTag = t('calendar.holiday');
        const finalTag = editHolTag.trim() ? editHolTag.trim().toUpperCase() : defaultTag;

        const updatedData = { name: editHolName, date: editHolDate, tag: finalTag };

        setters.setHolidays(state.holidays.map((h: any) =>
            h.id === id ? { ...h, ...updatedData } : h
        ));

        setEditingId(null);

        try {
            await updateHoliday(id, updatedData);
            setters.setCustomHolidays?.((state.customHolidays || []).map((h: Holiday) =>
                h.id === id ? { ...h, ...updatedData } : h
            ));
        } catch (error) {
            console.error(error);
            toast.error(t('messages.cloudError'), { position: 'top-left' });
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const [year, month, day] = dateStr.split('-');
        return language === 'en' ? `${month}/${day}/${year}` : `${day}/${month}/${year}`;
    };

    return (
        <div className="space-y-6">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                <h3 className="text-xs font-black uppercase text-zinc-400">{t('holidays.custom')}</h3>

                <input
                    placeholder={t('holidays.namePlaceholder')}
                    value={newHolName}
                    onChange={e => {
                        setNewHolName(e.target.value);
                        if (addErrors.name) setAddErrors({ ...addErrors, name: false });
                    }}
                    className={cn(
                        "w-full bg-white dark:bg-zinc-950 rounded-xl p-2.5 text-sm dark:text-white outline-none focus:ring-2 transition-all",
                        addErrors.name
                            ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                            : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                    )}
                />

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <input
                        type="date"
                        value={newHolDate}
                        onChange={e => {
                            setNewHolDate(e.target.value);
                            if (addErrors.date) setAddErrors({ ...addErrors, date: false });
                        }}
                        className={cn(
                            "w-full sm:flex-1 bg-white dark:bg-zinc-950 rounded-xl p-2.5 text-sm dark:text-white outline-none focus:ring-2 transition-all cursor-pointer",
                            addErrors.date
                                ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                        )}
                    />
                    <div className="w-full sm:flex-1 relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Tag size={14} className="text-zinc-400" />
                        </div>
                        <input
                            placeholder={t('holidays.tagPlaceholder')}
                            value={newHolTag}
                            onChange={e => setNewHolTag(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase placeholder:normal-case"
                        />
                    </div>
                </div>

                <Button onClick={handleAddHoliday} className="w-full py-6 sm:py-2"> {/* Botão maior no mobile para facilitar o toque de dedo */}
                    <Plus size={14} /> {t('holidays.addButton')}
                </Button>
            </div>

            <div className="space-y-2">
                {state.holidays.map((h: any) => {
                    if (editingId === h.id) {
                        return (
                            <div key={h.id} className="p-3 bg-white dark:bg-zinc-900 border border-blue-500 dark:border-blue-500 rounded-xl space-y-3 shadow-sm animate-in fade-in">
                                <input
                                    value={editHolName}
                                    onChange={e => {
                                        setEditHolName(e.target.value);
                                        if (editErrors.name) setEditErrors({ ...editErrors, name: false });
                                    }}
                                    className={cn(
                                        "w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg p-2 text-xs dark:text-white outline-none focus:ring-2",
                                        editErrors.name
                                            ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                            : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                                    )}
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        type="date"
                                        value={editHolDate}
                                        onChange={e => {
                                            setEditHolDate(e.target.value);
                                            if (editErrors.date) setEditErrors({ ...editErrors, date: false });
                                        }}
                                        className={cn(
                                            "w-full sm:w-1/2 bg-zinc-50 dark:bg-zinc-950 rounded-lg p-2 text-xs dark:text-white outline-none focus:ring-2",
                                            editErrors.date
                                                ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                                : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                                        )}
                                    />
                                    <input
                                        placeholder={t('holidays.tagPlaceholder')}
                                        value={editHolTag}
                                        onChange={e => setEditHolTag(e.target.value)}
                                        className="w-full sm:w-1/2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 uppercase"
                                    />
                                </div>
                                <div className="flex gap-2 justify-end mt-2">
                                    <button onClick={cancelEditing} className="flex-1 sm:flex-none justify-center px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold bg-transparent border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center">
                                        <X size={14} className="mr-1" /> {t('holidays.cancelEdit')}
                                    </button>
                                    <Button onClick={() => saveEdit(h.id)} className="flex-1 sm:flex-none justify-center px-3 py-2 sm:py-1.5 h-auto text-xs flex items-center">
                                        <Check size={14} className="mr-1" /> {t('holidays.editButton')}
                                    </Button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={h.id} className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex justify-between items-center group shadow-sm overflow-hidden gap-2">
                            <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2 min-w-0">
                                    <p className="text-xs font-bold dark:text-zinc-200 truncate" title={h.name}>
                                        {h.name}
                                    </p>
                                    <span
                                        className="px-1.5 py-0.5 rounded text-[8px] font-black tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase truncate max-w-[80px] shrink-0"
                                        title={h.tag || t('calendar.holiday')}
                                    >
                                        {h.tag || t('calendar.holiday')}
                                    </span>
                                </div>
                                <p className="text-[10px] text-zinc-400">{formatDate(h.date)}</p>
                            </div>
                            {!h.isNacional && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                    <button onClick={() => startEditing(h)} className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => removeItem(h.id)} className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
