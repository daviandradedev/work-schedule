import { toast } from "sonner";
import { Group, Employee } from "@/lib/types/types";
import { useLanguage } from "@/lib/contexts/language-context";
import {
    createEmployee,
    createGroup,
    deleteEmployee,
    deleteGroup,
    updateEmployee as updateEmployeeRequest,
    updateGroup as updateGroupRequest,
} from "@/lib/api/client";

export function useTeams(state: any, setters: any) {
    const { t } = useLanguage();

    const addGroup = async (name: string, color: string = "#3b82f6") => {
        if (!name.trim()) return toast.error(t('messages.enterTeamName') || 'Informe o nome da equipe');

        try {
            const newGroup = await createGroup({ name, color });
            const newGroupsList = [...state.groups, newGroup];
            setters.setGroups(newGroupsList);

            if (newGroupsList.length === 1) {
                setters.setStartingGroupId(newGroup.id);
            }
            toast.success(t('messages.teamCreated') || 'Equipe criada');
        } catch (error) {
            console.error(error);
            toast.error(t('messages.cloudError') || 'Erro na nuvem');
        }
    };

    const updateGroup = async (id: string, name: string, color: string) => {
        if (!name.trim() || !color) return;

        setters.setGroups(state.groups.map((g: Group) => g.id === id ? { ...g, name, color } : g));
        try {
            await updateGroupRequest(id, { name, color });
        } catch (error) {
            console.error(error);
            toast.error(t('messages.cloudError') || 'Erro na nuvem');
        }
    };

    const removeGroup = async (id: string) => {
        const updatedGroups = state.groups.filter((g: Group) => g.id !== id);
        setters.setGroups(updatedGroups);

        if (state.startingGroupId === id) {
            setters.setStartingGroupId(updatedGroups.length > 0 ? updatedGroups[0].id : undefined);
        }

        try {
            await deleteGroup(id);
        } catch (error) {
            console.error(error);
            toast.error(t('messages.deleteError') || 'Erro ao deletar');
        }
    };

    const addEmployee = async (name: string, groupId: string) => {
        if (!name.trim() || !groupId) return toast.error(t('messages.nameAndTeamReq') || 'Nome e equipe são obrigatórios');

        try {
            const newEmp = await createEmployee({ name, groupId });
            setters.setEmployees([...state.employees, newEmp]);
            toast.success(t('messages.empAdded') || 'Funcionário adicionado');
        } catch (error) {
            console.error(error);
            toast.error(t('messages.cloudError') || 'Erro na nuvem');
        }
    };

    const updateEmployee = async (id: string, newName: string, newGroupId: string) => {
        if (!newName.trim() || !newGroupId) return;

        setters.setEmployees(state.employees.map((e: Employee) =>
            e.id === id ? { ...e, name: newName, groupId: newGroupId } : e
        ));

        try {
            await updateEmployeeRequest(id, { name: newName, groupId: newGroupId });
        } catch (error) {
            console.error(error);
            toast.error(t('messages.cloudError') || 'Erro na nuvem');
        }
    };

    const removeEmployee = async (id: string) => {
        setters.setEmployees(state.employees.filter((e: Employee) => e.id !== id));
        try {
            await deleteEmployee(id);
        } catch (error) {
            console.error(error);
            toast.error(t('messages.deleteError') || 'Erro ao deletar');
        }
    };

    return { addGroup, updateGroup, removeGroup, addEmployee, updateEmployee, removeEmployee };
}
