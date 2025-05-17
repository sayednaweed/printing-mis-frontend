import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LeaveTable } from "./leave-table"; // Assuming LeaveTable component is correct
import UserHeader from "../users/user-header"; // Assuming the UserHeader component is correct
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";

export default function LeavePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1); // Navigate to previous page
  const handleGoHome = () => navigate("/dashboard", { replace: true }); // Navigate to home

  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("leave")}</BreadcrumbItem>
      </Breadcrumb>
      <UserHeader />
      <LeaveTable />
    </div>
  );
}
