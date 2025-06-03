import { FileType } from "@/lib/types";
import { DateObject } from "react-multi-date-picker";

export type Role =
  | { role: 1; name: "super" }
  | { role: 2; name: "admin" }
  | { role: 3; name: "user" };

export type StatusType = { active: 1 } | { blocked: 2 };

export type SelectUserPermission = UserPermission & {
  allSelected: boolean;
};
export type Contact = {
  id: string;
  value: string;
  created_at: string;
};
export type Email = {
  id: string;
  value: string;
  created_at: string;
};
export type Status = {
  id: number;
  name: string;
  created_at: string;
};
export type User = {
  id: string;
  registration_number: string;
  full_name: string;
  username: string;
  email: string;
  status: number;
  grant: boolean;
  profile: any;
  role: Role;
  contact: string;
  job: string;
  destination: string;
  permissions: PortalPermissions;
  created_at: string;
  gender: string;
};
export type Permission = {
  name: string;
};
export interface SubPermission {
  id: number;
  name: string;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  singleRow: boolean;
}

export type UserPermission = {
  id: number;
  edit: boolean;
  view: boolean;
  delete: boolean;
  add: boolean;
  visible: boolean;
  permission: string;
  icon: string;
  priority: number;
  sub: Map<number, SubPermission>;
};

export type PortalPermissions = Record<string, Map<string, UserPermission>>;

export type Notifications = {
  id: string;
  message: string;
  type: string;
  read_status: number;
  created_at: string;
};
export type SimpleItem = {
  id: string;
  name: string;
  created_at: string;
};

export type LeaveItem = {
  id: string;
  name: string;
  start_date: Date;
  end_date: Date;
  reason: string;
  created_at: string;
};

export type HireTypeItem = {
  id: string;
  name: string;
  created_at: string;
  description: string;
};
export type SimpleShiftItem = {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  description: string;
  created_at: string;
};
export type Gender = {
  id: string;
  name: string;
};
export type NidType = {
  id: string;
  name: string;
};
// APPLICATION

export type Country = {
  id: string;
  name: string;
};
export type District = {
  id: string;
  name: string;
};
export type Province = {
  id: string;
  name: string;
};
export type Address = {
  id: string;
  country: Country;
  province: Province;
  district: District;
  area: string;
};

export type Audit = {
  id: string;
  user_id: string;
  user: string;
  action: string;
  table: string;
  table_id: string;
  old_values: any;
  new_values: any;
  url: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
};

///////////////////////////////App

export type CheckList = {
  id: string;
  type: string;
  type_id: number;
  name: string;
  acceptable_extensions: string;
  active: number;
  file_size: number;
  acceptable_mimes: string;
  accept: string;
  description: string;
  saved_by: string;
  created_at: string;
};

export interface Currency {
  id: number;
  name: string;
}
export type Employee = {
  id: string;
  hr_code: string;
  first_name: string;
  last_name: string;
  father_name: string;
  picture: any;
  contact: string;
  email: string;
  status: number;
  status_name: string;
  gender: string;
  nationality: string;
  hire_date: string;
};
export type EmployeeModel = {
  id: string;
  hr_code: string;
  date_of_birth: string | DateObject;
  picture: any;
  contact: string;
  family_mem_contact: string;
  email: string;
  permanent_province: { id: string; name: string };
  permanent_district: { id: string; name: string };
  permanent_area: string;
  current_province: { id: string; name: string };
  current_district: { id: string; name: string };
  current_area: string;
  nationality: { id: string; name: string };
  gender: { id: string; name: string };
  marital_status: { id: string; name: string };
  is_current_employee: boolean;
  first_name: string;
  last_name: string;
  father_name: string;
  attachment: FileType | undefined;
};
export type EmployeeMore = {
  identity_card: { id: number; name: string };
  register: string;
  volume: string;
  page: string;
  register_no: string;
  education_level: { id: string; name: string };
  attachment: FileType | undefined;
};
export type PositionAssignment = {
  id: string;
  hire_type: string;
  salary: string;
  shift: string;
  position: string;
  position_change_type: string;
  overtime_rate: string;
  currency: string;
  department: string;
  hire_date: string;
};

export type EmployeeReport = {
  emp_id: string;
  emp_name: string;
  department: string;
  position: string;
  email: string;
  hire_date: string;
  status: string;
};

export type EmployeeStatus = {
  id: string;
  status_id: number;
  status_name: string;
  saved_by: string;
  active: number;
  description: string;
  created_at: string;
};

export type Leave = {
  id: string;
  hr_code: string;
  picture: string;
  employee_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  leave_type: string;
  saved_by: string;
  created_at: string;
};
export type AttendanceStatus = {
  id: string;
  name: string;
  selected: boolean;
};
export type Attendance = {
  id: string;
  picture: string;
  hr_code: string;
  first_name: string;
  last_name: string;
  detail: string;
  status: AttendanceStatus[];
  check_in_time: string;
  check_out_time: string;
  check_in_taken_by: string;
  check_out_taken_by: string;
  created_at: string;
};
export type AttendanceModel = {
  present: string;
  absent: string;
  leave: string;
  other: string;
  check_in_time: string;
  check_out_time: string;
  check_in_taken_by: string;
  check_out_taken_by: string;
  created_at: string;
};
export type ExpenseType = {
  id: string;
  name: string;
  icon_id: string;
  expense_type_id: string;
  created_at: string;
};
export type PartyModel = {
  id: string;
  email: string;
  contact: string;
  name: string;
  logo: any;
  company_name: string;
};
export type Party = {
  id: string;
  email: string;
  contact: string;
  name: string;
  nationality: { id: string; name: string };
  current_province: { id: string; name: string };
  current_district: { id: string; name: string };
  current_area: any;
  logo: any;
  company_name: string;
};
