import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { Group, Employee } from "@/lib/types/types";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/contexts/language-context";

interface EmployeeListProps {
    groups: Group[];
    employees: Employee[];
    onRemove: (id: string) => void;
    onEdit: (id: string, name: string, groupId: string) => void;
}

export function EmployeeList({ groups, employees, onRemove, onEdit }: EmployeeListProps) {
    const { t } = useLanguage();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editGroupId, setEditGroupId] = useState("");

    if (employees.length === 0) return null;

    const startEditing = (emp: Employee) => {
        setEditingId(emp.id);
        setEditName(emp.name);
        setEditGroupId(emp.groupId);
    };

    const handleSave = () => {
        onEdit(editingId as string, editName, editGroupId);
        setEditingId(null);
    };

    const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));
    const teamsWithEmployees = groups.map(g => ({
        ...g,
        employees: sortedEmployees.filter(e => e.groupId === g.id)
    })).filter(g => g.employees.length > 0);
    const unassignedEmployees = sortedEmployees.filter(e => !groups.some(g => g.id === e.groupId));

    const renderEmployeeCard = (emp: Employee) => (
        <div key={emp.id} className="px-4 py-1.5 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm group">
            {editingId === emp.id ? (
                <div className="flex flex-col sm:flex-row gap-3 w-full animate-in fade-in zoom-in-95 duration-200">
                    <input
                        value={editName} onChange={e => setEditName(e.target.value)}
                        className="w-full sm:flex-1 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    <div className="flex gap-2 items-center w-full sm:w-auto">
                        <Select value={editGroupId} onChange={(e) => setEditGroupId(e.target.value)} className="flex-1 sm:w-40 text-sm">
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </Select>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 rounded-xl dark:text-green-400 dark:hover:bg-green-500/20 transition-colors"><Check size={16} /></button>
                            <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-100 rounded-xl dark:text-red-400 dark:hover:bg-red-500/20 transition-colors"><X size={16} /></button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-between items-center w-full">
                    <p className="font-bold text-sm dark:text-zinc-200 truncate pr-2">{emp.name}</p>
                    <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEditing(emp)} className="p-2 text-zinc-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            <Pencil size={16} />
                        </button>
                        <button onClick={() => onRemove(emp.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6 pt-4">
            {teamsWithEmployees.map(group => (
                <div key={group.id} className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-3 h-3 rounded-full shadow-sm shrink-0" style={{ backgroundColor: group.color }} />
                        <h4 className="text-xs font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider truncate">
                            {group.name}
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {group.employees.map(renderEmployeeCard)}
                    </div>
                </div>
            ))}

            {unassignedEmployees.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 shadow-sm shrink-0" />
                        <h4 className="text-xs font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
                            {t('calendar.unassigned')}
                        </h4>
                    </div>
                    <div className="space-y-3">
                        {unassignedEmployees.map(renderEmployeeCard)}
                    </div>
                </div>
            )}
        </div>
    );
}
