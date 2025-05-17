import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EmployeesTable } from "./employees-table";
import EmployeesHeader from "./employees-header";
export interface UserPageProps {}
export default function EmployeesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });

  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("employees")}</BreadcrumbItem>
      </Breadcrumb>
      <EmployeesHeader />
      <EmployeesTable />
    </div>
  );
}
