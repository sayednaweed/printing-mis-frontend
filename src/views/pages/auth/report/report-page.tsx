import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import AttendanceReport from "./tabs/Attendance";
import { UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import SalaryReport from "./tabs/Salary";
import ReportTemplate from "./tabs/general_report_template";

export default function ReportPage() {
  const { t, i18n } = useTranslation();
  const { user, portal } = useAuthStore();

  const direction = i18n.dir();
  const configurationName =
    portal == PortalEnum.hr
      ? "hr_configurations"
      : portal == PortalEnum.inventory
      ? "inv_configurations"
      : "exp_configurations";
  const per: UserPermission = user?.permissions[portal].get(
    configurationName
  ) as UserPermission;

  const tableList = Array.from(per.sub).map(
    ([key, _subPermission], index: number) => {
      return key == PermissionEnum.configurations.sub.hr_configuration_job ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow  rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <Briefcase className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("attendance")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.hr_configuration_department ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("salary")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.hr_configuration_leave_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("reportTemplate")}
        </TabsTrigger>
      ) : undefined;
    }
  );
  return (
    <>
      <Breadcrumb className="mx-2 mt-2">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("report")}</BreadcrumbItem>
      </Breadcrumb>
      <Tabs
        dir={direction}
        defaultValue={per.sub.values().next().value?.id.toString()}
        className="flex flex-col items-center pb-12"
      >
        <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          {tableList}
        </TabsList>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_job.toString()}
          className="w-full px-2 "
        >
          <AttendanceReport />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_department.toString()}
          className="w-full px-2 "
        >
          <SalaryReport />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_leave_type.toString()}
          className="w-full px-2 "
        >
          <ReportTemplate />
        </TabsContent>
      </Tabs>
    </>
  );
}
