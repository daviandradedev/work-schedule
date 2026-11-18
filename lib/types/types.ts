export type Regime = 'business_days' | 'seven_by_seven' | 'mon_to_sat';

export type Employee = {
  id: string;
  name: string;
  groupId: string;
  user_id?: string;
};

export type Group = {
  id: string;
  name: string;
  color: string;
  user_id?: string;
};

export type Holiday = {
  id: string;
  date: string;
  name: string;
  isNacional: boolean;
  user_id?: string;
  tag?: string;
};

export type EmployeeOnDuty = Employee & {
  isAbsent?: boolean;
};

export type ScheduleDay = {
  date: Date;
  isHoliday: boolean;
  holidayName?: string;
  holidayTag?: string;
  isWeekend: boolean;
  isWorkDay: boolean;
  group?: Group;
  employees?: EmployeeOnDuty[];
};

export interface GenerateScheduleParams {
  year: number;
  month: number;
  regime: Regime;
  startingGroupId?: string;
  groups: Group[];
  holidays: Holiday[];
}

export interface SidebarProps {
  state: {
    month: number;
    year: number;
    regime: Regime;
    groups: Group[];
    employees: Employee[];
    holidays: Holiday[];
    customHolidays?: Holiday[];
    startingGroupId?: string;
  };
  setters: {
    setMonth: (v: number) => void;
    setYear: (v: number) => void;
    setRegime: (v: Regime) => void;
    setGroups: (v: Group[]) => void;
    setEmployees: (v: Employee[]) => void;
    setHolidays: (v: Holiday[]) => void;
    setCustomHolidays?: (v: Holiday[]) => void;
    setStartingGroupId: (v: string | undefined) => void;
  };
  theme: string | undefined;
  setTheme: (theme: string) => void;
}
