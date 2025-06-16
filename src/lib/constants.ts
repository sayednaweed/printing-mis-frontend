export const LanguageEnum = {
  english: "english",
  farsi: "farsi",
  pashto: "pashto",
};

export const PortalEnum = {
  hr: 1,
  inventory: 2,
  expense: 3,
};
export const ChecklistTypeEnum = {
  employee: 1,
  sellers: 2,
  buyers: 3,
};
export const ChecklistEnum = {
  employee_attachment: 1,
  sellers_logo: 2,
  buyers_logo: 3,
};
export const HireTypeEnum = {
  contractual: 1,
  permanent: 2,
  temporary: 3,
  internship: 4,
};
export const RoleEnum = {
  super: 1,
};
export const NidTypeEnum = {
  passport: 1,
  id_card: 2,
  paper_id_card: 3,
};
export const PartyTypeEnum = {
  sellers: 1,
  buyers: 2,
};
export const PermissionEnum = {
  dashboard: { name: "dashboard", sub: {} },
  employees: {
    name: "employees",
    sub: {
      personal_information: 1,
      promotion_demotion: 2,
      employee_status: 3,
    },
  },
  users: {
    name: "users",
    sub: {
      user_information: 1,
      user_password: 2,
      user_permission: 3,
    },
  },
  leave: {
    name: "leave",
    sub: {},
  },
  attendance: {
    name: "attendance",
    sub: {},
  },
  expenses: {
    name: "expenses",
    sub: {},
  },
  sellers: {
    name: "sellers",
    sub: {
      personal_information: 61,
      transactions: 62,
    },
  },
  buyers: {
    name: "buyers",
    sub: {
      personal_information: 71,
      transactions: 72,
    },
  },
  accounts: {
    name: "accounts",
    sub: {
      detail: 161,
      expenses: 162,
      sales: 163,
      purchases: 164,
      salaries: 165,
    },
  },
  reports: { name: "reports", sub: {} },
  configurations: {
    name: "configurations",
    sub: {
      hr_configuration_job: 21,
      hr_configuration_department: 22,
      hr_configuration_leave: 23,
      hr_configuration_shifts: 24,
      hr_configuration_hire_type: 25,
      expense_configuration_expense_type: 51,
      expense_configuration_expense_icon: 52,
      inventory_configuration_warehouse: 111,
      inventory_configuration_material: 112,
      inventory_configuration_material_type: 113,
      inventory_configuration_size_unit: 114,
      inventory_configuration_size: 115,
      inventory_configuration_weight: 116,
      inventory_configuration_weight_unit: 117,
    },
  },
  logs: { name: "logs", sub: {} },
  audit: { name: "audit", sub: {} },
  activity: {
    name: "activity",
    sub: {
      user_activity: 41,
      self_activity: 42,
    },
  },
};
export const StatusEnum = {
  hired: 1,
  resigned: 2,
  terminated: 3,
  absconded: 4,
  deceased: 5,
  working: 6,
  // User status
  active: 7,
  in_active: 8,
};
export const AttendanceStatusEnum = {
  present: 1,
  absent: 2,
  leave: 3,
  sick: 4,
};

export const UserStatusEnum = {
  active: 1,
  block: 2,
};
export const CountryEnum = {
  afghanistan: 2,
};

export const PERMISSIONS_OPERATION = ["Add", "Edit", "Delete", "View"];

export const DestinationTypeEnum = {
  muqam: "1",
  directorate: "2",
};
export const afgMonthNamesFa = [
  "حمل",
  "ثور",
  "جوزا",
  "سرطان",
  "اسد",
  "سنبله",
  "میزان",
  "عقرب",
  "قوس",
  "جدی",
  "دلو",
  "حوت",
];
export const afgMonthNamesEn = [
  "Hamal",
  "Sawr",
  "Jawza",
  "Saratan",
  "Asad",
  "Sonbola",
  "Mezan",
  "Aqrab",
  "Qaws ",
  "Jadi ",
  "Dalwa",
  "Hoot",
];
// Indexedb keys
export const CALENDAR = {
  Gregorian: "1",
  SOLAR: "2",
  LUNAR: "3",
};
export const CALENDAR_LOCALE = {
  english: "1",
  farsi: "2",
  arabic: "3",
};
export const CALENDAR_FORMAT = {
  format_1: "YYYY-MM-DD hh:mm A",
  format_2: "YYYY-MM-DD",
  format_3: "YYYY/MM/dddd",
  format_4: "dddd DD MMMM YYYY / hh:mm:ss A",
};
export const CACHE = {
  VACCINE_CERTIFICATE_TABLE_PAGINATION_COUNT: "VACCINE_CERTIFICATE_TABLE",
  USER_TABLE_PAGINATION_COUNT: "USER_TABLE",
  EMPLOYEE_TABLE_PAGINATION_COUNT: "EMPLOYEE_TABLE",
  EMPLOYEEREPORT_TABLE_PAGINATION_COUNT: "EMPLOYEEREPORT_TABLE",
  ATTENDANCE_TABLE_PAGINATION_COUNT: "ATTENDANCE_TABLE",
  SELLERS_TABLE_PAGINATION_COUNT: "SELLERS_TABLE",
  Buyers_TABLE_PAGINATION_COUNT: "BUYERS_TABLE",
  ACCOUNTS_TABLE_PAGINATION_COUNT: "ACCOUNTS_TABLE",
  EXPENSE_TABLE_PAGINATION_COUNT: "EXPENSE_TABLE",
  LEAVE_TABLE_PAGINATION_COUNT: "LEAVE_TABLE",
  AUDIT_TABLE_PAGINATION_COUNT: "AUDIT_TABLE",
  SYSTEM_CALENDAR: "SYSTEM_CALENDAR",
};
export const ReportSelectionEnum = {
  individual: 1,
  all: 2,
};
export const ReportTypeSelectionEnum = {
  salary: 1,
  attendance: 2,
};

export const attendanceReportType = {
  individual: 1,
  general: 2,
};

export const ReportTypeSalary = {
  individual: 1,
  general: 2,
};
