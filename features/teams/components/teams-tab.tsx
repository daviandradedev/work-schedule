import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/contexts/language-context";
import { cn } from "@/lib/utils";
import { useTeams } from "../hooks/use-teams";
import { EmployeeList } from "./employee-list";
import { toast } from "sonner";

const ALL_COLORS = [
    "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f43f5e",
    "#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0d9488", "#e11d48",
    "#b91c1c", "#1d4ed8", "#047857", "#b45309", "#6d28d9", "#be185d", "#0f766e", "#be123c",
    "#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6", "#2dd4bf", "#fb7185",
    "#6366f1", "#06b6d4", "#f97316", "#84cc16", "#4f46e5", "#0891b2", "#ea580c", "#65a30d"
];

export function TeamsTab({ state, setters }: any) {
    const { t } = useLanguage();
    const { addGroup, updateGroup, removeGroup, addEmployee, updateEmployee, removeEmployee } = useTeams(state, setters);

    const safeGroups = state?.groups || [];
    const safeEmployees = state?.employees || [];

    const [targetGroupCount, setTargetGroupCount] = useState<number>(safeGroups.length || 0);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupColor, setNewGroupColor] = useState("");
    const [addTeamErrors, setAddTeamErrors] = useState({ name: false, color: false });

    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [editGroupName, setEditGroupName] = useState("");
    const [editGroupColor, setEditGroupColor] = useState("");
    const [editTeamErrors, setEditTeamErrors] = useState({ name: false });

    const [newEmpName, setNewEmpName] = useState("");
    const [newEmpGroupId, setNewEmpGroupId] = useState("");
    const [addEmpErrors, setAddEmpErrors] = useState({ name: false, group: false });

    useEffect(() => {
        if (safeGroups.length > targetGroupCount || targetGroupCount === 0) {
            setTargetGroupCount(safeGroups.length);
        }
    }, [safeGroups.length, targetGroupCount]);

    const handleCountChange = (val: string) => {
        const num = Number(val);
        setTargetGroupCount(num < safeGroups.length ? safeGroups.length : num);
    };

    const handleAddGroupClick = async () => {
        const hasErrorName = !newGroupName.trim();
        const hasErrorColor = !newGroupColor;

        if (hasErrorName || hasErrorColor) {
            setAddTeamErrors({ name: hasErrorName, color: hasErrorColor });
            if (hasErrorName) {
                toast.error(t('messages.enterTeamName'), { position: 'top-left' });
            } else if (hasErrorColor) {
                toast.error(t('teams.colorRequired'), { position: 'top-left' });
            }
            return;
        }

        await addGroup(newGroupName, newGroupColor);
        setNewGroupName("");
        setNewGroupColor("");
        setAddTeamErrors({ name: false, color: false });
    };

    const handleSaveEditGroup = async () => {
        if (!editingGroupId) return;

        const hasErrorName = !editGroupName.trim();
        if (hasErrorName) {
            setEditTeamErrors({ name: true });
            toast.error(t('messages.enterTeamName'), { position: 'top-left' });
            return;
        }

        await updateGroup(editingGroupId, editGroupName, editGroupColor);
        setEditingGroupId(null);
        setEditTeamErrors({ name: false });
    };

    const handleAddEmployeeClick = async () => {
        const hasErrorName = !newEmpName.trim();
        const hasErrorGroup = !newEmpGroupId;

        if (hasErrorName || hasErrorGroup) {
            setAddEmpErrors({ name: hasErrorName, group: hasErrorGroup });
            toast.error(t('messages.nameAndTeamReq'), { position: 'top-left' });
            return;
        }

        await addEmployee(newEmpName, newEmpGroupId);
        setNewEmpName("");
        setNewEmpGroupId("");
        setAddEmpErrors({ name: false, group: false });
    };

    const canAddMoreGroups = targetGroupCount > safeGroups.length;
    const availableColorsForNew = ALL_COLORS.filter(c => !safeGroups.some((g: any) => g.color === c)).slice(0, 8);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold dark:text-zinc-200">
                        {t('teams.rotationCount')}
                    </label>
                    <input
                        type="number" min={safeGroups.length} value={targetGroupCount} onChange={e => handleCountChange(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    {targetGroupCount === safeGroups.length && safeGroups.length > 0 && (
                        <p className="text-[10px] text-zinc-400 mt-1 italic">
                            {t('teams.increaseValueHint')}
                        </p>
                    )}
                </div>

                {canAddMoreGroups && (
                    <div className={cn(
                        "px-4 py-3 sm:p-5 bg-zinc-50 dark:bg-zinc-900 border rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 transition-all",
                        addTeamErrors.color ? "border-red-500 dark:border-red-500" : "border-zinc-200 dark:border-zinc-800"
                    )}>
                        <h4 className="text-[10px] font-black uppercase text-zinc-400 flex justify-between">
                            <span>{t('teams.creatingTeam')} {safeGroups.length + 1} {t('teams.of')} {targetGroupCount}</span>
                            <span className="text-blue-500">{safeGroups.length + 1} / {targetGroupCount}</span>
                        </h4>
                        <input
                            placeholder={t('teams.namePlaceholder')}
                            value={newGroupName}
                            onChange={e => {
                                setNewGroupName(e.target.value);
                                if (addTeamErrors.name) setAddTeamErrors({ ...addTeamErrors, name: false });
                            }}
                            className={cn(
                                "w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 transition-all",
                                addTeamErrors.name
                                    ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                    : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                            )}
                        />
                        <div className="flex flex-wrap gap-3">
                            {availableColorsForNew.map(color => (
                                <button
                                    key={color}
                                    onClick={() => {
                                        setNewGroupColor(color);
                                        if (addTeamErrors.color) setAddTeamErrors({ ...addTeamErrors, color: false });
                                    }}
                                    className={cn("w-8 h-8 rounded-full border-2 transition-all cursor-pointer hover:scale-110", newGroupColor === color ? "border-zinc-900 dark:border-white scale-110" : "border-transparent")}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                        <Button onClick={handleAddGroupClick} className="w-full">
                            <Plus size={16} /> {t('teams.addButton')}
                        </Button>
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    {safeGroups.map((g: any) => {
                        const editAvailableColors = Array.from(new Set([g.color, ...ALL_COLORS.filter(c => !safeGroups.some((other: any) => other.id !== g.id && other.color === c))])).slice(0, 8);
                        return (
                            <div key={g.id} className="px-4 py-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm group">
                                {editingGroupId === g.id ? (
                                    <div className="flex flex-col gap-4 w-full">
                                        <input
                                            value={editGroupName}
                                            onChange={e => {
                                                setEditGroupName(e.target.value);
                                                if (editTeamErrors.name) setEditTeamErrors({ name: false });
                                            }}
                                            className={cn(
                                                "w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 transition-all",
                                                editTeamErrors.name
                                                    ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                                    : "border border-zinc-200 dark:border-zinc-700 focus:ring-blue-500/50"
                                            )}
                                        />
                                        <div className="flex justify-between items-center gap-4">
                                            <div className="flex gap-2 flex-wrap flex-1">
                                                {editAvailableColors.map(color => (
                                                    <button key={color} onClick={() => setEditGroupColor(color)} className={cn("w-7 h-7 rounded-full border-2 transition-all cursor-pointer hover:scale-110", editGroupColor === color ? "border-zinc-900 dark:border-white scale-110" : "border-transparent")} style={{ backgroundColor: color }} />
                                                ))}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={handleSaveEditGroup} className="p-2 text-green-600 hover:bg-green-100 rounded-xl transition-colors"><Check size={16} /></button>
                                                <button onClick={() => { setEditingGroupId(null); setEditTeamErrors({ name: false }); }} className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors"><X size={16} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: g.color }} />
                                            <span className="text-sm font-bold dark:text-zinc-200">{g.name}</span>
                                        </div>
                                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingGroupId(g.id); setEditGroupName(g.name); setEditGroupColor(g.color); }} className="p-2 text-zinc-400 hover:text-blue-500 transition-colors">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => removeGroup(g.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <hr className="border-zinc-100 dark:border-zinc-800" />

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-zinc-400">
                    {t('teams.addEmployee')}
                </h3>
                <div className="flex flex-col gap-3">
                    <input
                        placeholder={t('teams.empNamePlaceholder')}
                        value={newEmpName}
                        onChange={e => {
                            setNewEmpName(e.target.value);
                            if (addEmpErrors.name) setAddEmpErrors({ ...addEmpErrors, name: false });
                        }}
                        disabled={safeGroups.length === 0}
                        className={cn(
                            "w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 disabled:opacity-50 transition-all",
                            addEmpErrors.name
                                ? "border border-red-500 focus:ring-red-500/50 dark:border-red-500"
                                : "border border-zinc-200 dark:border-zinc-800 focus:ring-blue-500/50"
                        )}
                    />
                    <div className={cn("rounded-xl transition-all", addEmpErrors.group ? "border border-red-500 ring-2 ring-red-500/50 dark:border-red-500" : "")}>
                        <Select
                            value={newEmpGroupId}
                            onChange={(e) => {
                                setNewEmpGroupId(e.target.value);
                                if (addEmpErrors.group) setAddEmpErrors({ ...addEmpErrors, group: false });
                            }}
                            disabled={safeGroups.length === 0}
                        >
                            <option value="" disabled hidden>{t('teams.selectTeam')}</option>
                            {safeGroups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </Select>
                    </div>
                    <Button onClick={handleAddEmployeeClick} disabled={safeGroups.length === 0} className="w-full">
                        <Plus size={16} /> {t('teams.addEmployee')}
                    </Button>
                </div>

                <EmployeeList
                    groups={safeGroups}
                    employees={safeEmployees}
                    onRemove={removeEmployee}
                    onEdit={updateEmployee}
                />
            </div>
        </div>
    );
}
