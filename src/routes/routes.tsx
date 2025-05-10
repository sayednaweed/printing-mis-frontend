import { BrowserRouter, Route, Routes } from "react-router";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { User } from "@/database/tables";
import ProtectedRoute from "@/routes/protected-route";
import GuestLayout from "@/views/layout/guest-layout";
import AuthLayout from "@/views/layout/auth-layout";
import UsersProfilePage from "@/views/pages/auth/profile/users/users-profile-page";
import ConfigurationsPage from "@/views/pages/auth/configurations/configurations-page";
import SettingsPage from "@/views/pages/auth/setting/settings-page";
import ReportPage from "@/views/pages/auth/report/report-page";
import LoginPage from "@/views/pages/guest/login-page";
import ExpenseDashboardPage from "@/views/pages/auth/dashboard/expense-dashboard-page";
import ExpensesPage from "@/views/pages/auth/expense/expenses/expenses-page";
import HrDashboardPage from "@/views/pages/auth/dashboard/hr-dashboard-page";
import AttendancePage from "@/views/pages/auth/hr/attendance/attendance-page";
import LeavePage from "@/views/pages/auth/hr/leave/leave-page";
import SalaryPage from "@/views/pages/auth/hr/salary/salary-page";
import LogsPage from "@/views/pages/auth/hr/logs/logs-page";
import AuditPage from "@/views/pages/auth/audit/audit-page";
import InventoryDashboardPage from "@/views/pages/auth/dashboard/inventory-dashboard-page";
import SellersPage from "@/views/pages/auth/inventory/sellers/sellers-page";
import BuyersPage from "@/views/pages/auth/inventory/buyers/buyers-page";
import SellsPage from "@/views/pages/auth/inventory/sells/sells-page";
import PurchasesPage from "@/views/pages/auth/inventory/purchases/purchases-page";
import ProjectsPage from "@/views/pages/auth/inventory/projects/projects-page";
import WarehousesPage from "@/views/pages/auth/inventory/warehouses/warehouses-page";
import { PortalEnum } from "@/lib/constants";
import EmployeesPage from "@/views/pages/auth/hr/employees/employees-page";
import EmployeesEditPage from "@/views/pages/auth/hr/employees/edit/employees-edit-page";
import Unauthorized from "@/views/pages/error/unauthorized";
import UserPage from "@/views/pages/auth/hr/users/user-page";
import UserEditPage from "@/views/pages/auth/hr/users/edit/user-edit-page";

export const getHrRouter = (user: User, authenticated: boolean) => {
  let permissions = user.permissions[PortalEnum.hr];

  if (!permissions) {
    permissions = new Map();
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/" element={<HrDashboardPage />} />
          <Route path="dashboard" element={<HrDashboardPage />} />
          <Route
            path="employees"
            element={
              <ProtectedRoute
                element={<EmployeesPage />}
                routeName="employees"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="employees/:id"
            element={
              <ProtectedRoute
                element={<EmployeesEditPage />}
                routeName="employees"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute
                element={<AttendancePage />}
                routeName="attendance"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="leave"
            element={
              <ProtectedRoute
                element={<LeavePage />}
                routeName="leave"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="salaries"
            element={
              <ProtectedRoute
                element={<SalaryPage />}
                routeName="salaries"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="hr_reports"
            element={
              <ProtectedRoute
                element={<ReportPage />}
                routeName="hr_reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute
                element={<UserPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="users/:id"
            element={
              <ProtectedRoute
                element={<UserEditPage />}
                routeName="users"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="hr_configurations"
            element={
              <ProtectedRoute
                element={<ConfigurationsPage />}
                routeName="hr_configurations"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="logs"
            element={
              <ProtectedRoute
                element={<LogsPage />}
                routeName="logs"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="audit"
            element={
              <ProtectedRoute
                element={<AuditPage />}
                routeName="audit"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getInventoryRouter = (user: User, authenticated: boolean) => {
  let permissions = user.permissions[PortalEnum.inventory];

  if (!permissions) {
    permissions = new Map();
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route path="settings" element={<SettingsPage />} />
          <Route path="/" element={<InventoryDashboardPage />} />
          <Route path="dashboard" element={<InventoryDashboardPage />} />
          <Route
            path="sellers"
            element={
              <ProtectedRoute
                element={<SellersPage />}
                routeName="sellers"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="buyers"
            element={
              <ProtectedRoute
                element={<BuyersPage />}
                routeName="buyers"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="sells"
            element={
              <ProtectedRoute
                element={<SellsPage />}
                routeName="sells"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="purchases"
            element={
              <ProtectedRoute
                element={<PurchasesPage />}
                routeName="purchases"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                element={<ProjectsPage />}
                routeName="projects"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="warehouse"
            element={
              <ProtectedRoute
                element={<WarehousesPage />}
                routeName="warehouse"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="inv_reports"
            element={
              <ProtectedRoute
                element={<ReportPage />}
                routeName="inv_reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="inv_configurations"
            element={
              <ProtectedRoute
                element={<ConfigurationsPage />}
                routeName="inv_configurations"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        {/* Catch-all Route for Errors */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};
export const getExpenseRouter = (user: User, authenticated: boolean) => {
  let permissions = user.permissions[PortalEnum.expense];

  if (!permissions) {
    permissions = new Map();
  }
  return (
    <BrowserRouter>
      <Routes>
        {/* Super Routes (Protected) */}
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <AuthLayout />
            </I18nextProvider>
          }
        >
          <Route path="settings" element={<SettingsPage />} />
          <Route path="dashboard" element={<ExpenseDashboardPage />} />
          <Route path="/" element={<ExpenseDashboardPage />} />

          <Route path="profile" element={<UsersProfilePage />} />
          <Route
            path="expenses"
            element={
              <ProtectedRoute
                element={<ExpensesPage />}
                routeName="expenses"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="exp_reports"
            element={
              <ProtectedRoute
                element={<ReportPage />}
                routeName="exp_reports"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
          <Route
            path="exp_configurations"
            element={
              <ProtectedRoute
                element={<ConfigurationsPage />}
                routeName="exp_configurations"
                permissions={permissions}
                authenticated={authenticated}
              />
            }
          />
        </Route>
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export const getGuestRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <I18nextProvider i18n={i18n}>
              <GuestLayout />
            </I18nextProvider>
          }
        >
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};
