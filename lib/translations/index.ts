export type Language = 'pt' | 'en';

export const translations = {
    pt: {
        welcome: {
            title: 'GERADOR DE ESCALA DE TRABALHO PRESENCIAL',
            subtitle: 'Crie uma escala personalizada de trabalho presencial para seu time.',
            start: 'Iniciar Configuração'
        },
        wizard: {
            title: 'Configurar Escala',
            cancel: 'Cancelar',
            generate: 'Gerar Calendário'
        },
        loading: "Carregando escala...",
        title: "Escala de Trabalho Presencial",
        controlPanel: "Escala de Trabalho Presencial",
        tabs: {
            config: "Geral",
            teams: "Equipes",
            holidays: "Feriados e Recessos",
        },
        sidebar: {
            teamsAndSchedule: "Equipes e Escala",
            loggedInAs: "Conta Logada",
            calendar: "Calendário",
            logout: "Sair do Sistema"
        },
        config: {
            period: "Período da Escala",
            regime: "Regime de Trabalho",
            startingTeam: "Equipe Inicial",
            selectTeam: "Selecione a equipe...",
            businessDays: "SEGUNDA - SEXTA",
            monToSat: "SEGUNDA - SÁBADO",
            sevenBySeven: "DOM - DOM",
            regimes: {
                business_days: "SEGUNDA - SEXTA",
                mon_to_sat: "SEGUNDA - SÁBADO",
                seven_by_seven: "DOM - DOM"
            }
        },
        teams: {
            rotationCount: "Quantas equipes na rotação?",
            increaseValueHint: "Aumente o valor acima para liberar o cadastro de novas equipes.",
            creatingTeam: "Criando Equipe",
            team: "Equipe",
            of: "de",
            newTeam: "Nova Equipe",
            teamName: "Nome da Equipe",
            namePlaceholder: "Nome da Equipe",
            addTeam: "Adicionar Equipe",
            addButton: "Adicionar Equipe",
            newEmployee: "Novo Funcionário",
            fullName: "Nome Completo",
            empNamePlaceholder: "Nome Completo",
            selectTeam: "Selecionar Equipe...",
            addEmployee: "Adicionar Funcionário",
            addEmpButton: "Adicionar Funcionário",
            colorRequired: "Selecione uma cor para a equipe"
        },
        holidays: {
            custom: "Adicionar Data Específica",
            namePlaceholder: "Motivo (Ex: Ponto Facultativo)",
            tagPlaceholder: "Tag",
            addButton: "Adicionar Data",
            editButton: "Salvar",
            cancelEdit: "Cancelar",
            nameRequired: "O motivo da data é obrigatório.",
            dateRequired: "A data é obrigatória."
        },
        messages: {
            enterTeamName: "Por favor, insira o nome da equipe",
            cloudError: "Falha ao salvar na nuvem",
            teamCreated: "Equipe criada com sucesso!",
            nameAndTeamReq: "Nome e Equipe são obrigatórios",
            empAdded: "Funcionário adicionado com sucesso!",
            deleteError: "Falha ao excluir item",
            unauthenticated: "Usuário não autenticado. Faça login novamente."
        },
        calendar: {
            officialSchedule: "Escala Oficial de Revezamento",
            holiday: "FERIADO",
            offDuty: "Folga",
            unassigned: "Sem Equipe",
            weekdays: ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"]
        },
        pdf: {
            title: "ESCALA DE TRABALHO PRESENCIAL",
            subtitle: "Escala Oficial de Revezamento das Equipes",
        },
        auth: {
            successMsg: "Conta criada com sucesso! Faça login para entrar.",
            wrongCredentialsMsg: "E-mail ou senha incorretos.",
            createAccount: "Criar Conta",
            welcome: "Bem-vindo",
            signUpSubtitle: "Cadastre-se para salvar suas escalas na nuvem.",
            signInSubtitle: "Entre para gerenciar suas escalas de trabalho.",
            emailPlaceholder: "Seu melhor e-mail",
            passwordPlaceholder: "Sua senha secreta",
            loading: "Aguarde...",
            signUpButton: "Criar Minha Conta",
            signInButton: "Entrar no Sistema",
            toggleToSignIn: "Já tem uma conta? Clique para entrar",
            toggleToSignUp: "Ainda não tem conta? Crie uma grátis",
            emailExistsMsg: "Este e-mail já está cadastrado. Vá em 'Entrar'.",
            weakPasswordMsg: "A senha deve ter no mínimo 8 caracteres.",
        },
        footer: {
            credit: "Desenvolvido com 🥤 e código por Davi Andrade ©"
        }
    },
    en: {
        welcome: {
            title: 'ON-SITE WORK SCHEDULE GENERATOR',
            subtitle: 'Create a custom on-site work schedule for your team.',
            start: 'Start Configuration'
        },
        wizard: {
            title: 'Configure Schedule',
            cancel: 'Cancel',
            generate: 'Generate Calendar'
        },
        loading: "Loading schedule...",
        title: "On-site Work Schedule",
        controlPanel: "On-site Work Schedule",
        tabs: {
            config: "General",
            teams: "Teams",
            holidays: "Special Dates",
        },
        sidebar: {
            teamsAndSchedule: "Teams & Schedule",
            loggedInAs: "Logged In As",
            calendar: "Calendar",
            logout: "Logout"
        },
        config: {
            period: "Schedule Period",
            regime: "Work Regime",
            startingTeam: "Starting Team",
            selectTeam: "Select team...",
            businessDays: "MON - FRI",
            monToSat: "MON - SAT",
            sevenBySeven: "SUN - SUN",
            regimes: {
                business_days: "MON - FRI",
                mon_to_sat: "MON - SAT",
                seven_by_seven: "SUN - SUN"
            }
        },
        teams: {
            rotationCount: "How many teams in rotation?",
            increaseValueHint: "Increase the value above to allow registering new teams.",
            creatingTeam: "Creating Team",
            team: "Team",
            of: "of",
            newTeam: "New Team",
            teamName: "Team Name",
            namePlaceholder: "Team Name",
            addTeam: "Add Team",
            addButton: "Add Team",
            newEmployee: "New Employee",
            fullName: "Full Name",
            empNamePlaceholder: "Full Name",
            selectTeam: "Select Team...",
            addEmployee: "Add Employee",
            addEmpButton: "Add Employee",
            colorRequired: "Please select a team color"
        },
        holidays: {
            custom: "Add Specific Date",
            namePlaceholder: "Reason (e.g. Company Retreat)",
            tagPlaceholder: "Tag",
            addButton: "Add Date",
            editButton: "Save Changes",
            cancelEdit: "Cancel",
            nameRequired: "The date reason is required.",
            dateRequired: "The date is required."
        },
        messages: {
            enterTeamName: "Please enter a team name",
            cloudError: "Failed to save to cloud",
            teamCreated: "Team created successfully!",
            nameAndTeamReq: "Name and Team are required",
            empAdded: "Employee added successfully!",
            deleteError: "Failed to delete item",
            unauthenticated: "User not authenticated. Please log in again."
        },
        calendar: {
            officialSchedule: "Official Team Rotation Schedule",
            holiday: "HOLIDAY",
            offDuty: "Off-Duty",
            unassigned: "Unassigned",
            weekdays: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
        },
        pdf: {
            title: "ON-SITE WORK SCHEDULE",
            subtitle: "Official Team Rotation Schedule",
        },
        auth: {
            successMsg: "Account created successfully! Please log in.",
            wrongCredentialsMsg: "Incorrect email or password.",
            createAccount: "Create Account",
            welcome: "Welcome",
            signUpSubtitle: "Sign up to save your schedules to the cloud.",
            signInSubtitle: "Log in to manage your work schedules.",
            emailPlaceholder: "Your best email",
            passwordPlaceholder: "Your secret password",
            loading: "Please wait...",
            signUpButton: "Create My Account",
            signInButton: "Log Into System",
            toggleToSignIn: "Already have an account? Click to sign in",
            toggleToSignUp: "Don't have an account yet? Create one for free",
            emailExistsMsg: "This email is already registered. Please sign in.",
            weakPasswordMsg: "Password must be at least 8 characters.",
        },
        footer: {
            credit: "Crafted with 🥤 and code by Davi Andrade ©"
        }
    }
};
