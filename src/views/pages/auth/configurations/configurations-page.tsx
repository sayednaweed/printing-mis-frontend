import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPinHouse } from "lucide-react";
import { useTranslation } from "react-i18next";
import JobTab from "./tabs/job/job-tab";
import { UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import DepartmentTab from "./tabs/department/department-tab";
import HireTypeTab from "./tabs/hire-type/hire-type-tab";
import ShiftTab from "./tabs/shift/shift-type-tab";
import LeaveTab from "./tabs/leave/leave-type-tab";
import ExpenseTypeTab from "./tabs/expense-type/expense-type-tab";

export default function ConfigurationsPage() {
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
          {t("job")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.hr_configuration_department ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("department")}
        </TabsTrigger>
      ) : key == PermissionEnum.configurations.sub.hr_configuration_leave ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("leave_type")}
        </TabsTrigger>
      ) : key == PermissionEnum.configurations.sub.hr_configuration_shifts ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("work_shift")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.hr_configuration_hire_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("hire_type")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.expense_configuration_expense_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("expense_type")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.inventory_configuration_warehouse ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("warehouse")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.inventory_configuration_material ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("material")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub
          .inventory_configuration_material_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("material_type")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.inventory_configuration_size_unit ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("size_unit")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.inventory_configuration_size ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("size")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.inventory_configuration_weight ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("weight")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub
          .inventory_configuration_weight_unit ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("weight_unit")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.expense_configuration_expense_type ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("expense_type")}
        </TabsTrigger>
      ) : key ==
        PermissionEnum.configurations.sub.expense_configuration_expense_icon ? (
        <TabsTrigger
          key={index}
          value={key.toString()}
          className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
        >
          <MapPinHouse className="size-[16px] ltr:mr-1 rtl:ml-1" />
          {t("expense_icon")}
        </TabsTrigger>
      ) : undefined;
    }
  );
  return (
    <>
      <Breadcrumb className="mx-2 mt-2">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("settings")}</BreadcrumbItem>
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
          className="w-full px-4 pt-8"
        >
          <JobTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_department.toString()}
          className="w-full px-4 pt-8"
        >
          <DepartmentTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_leave.toString()}
          className="w-full px-4 pt-8"
        >
          <LeaveTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_shifts.toString()}
          className="w-full px-4 pt-8"
        >
          <ShiftTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.hr_configuration_hire_type.toString()}
          className="w-full px-4 pt-8"
        >
          <HireTypeTab permissions={per} />
        </TabsContent>
        <TabsContent
          value={PermissionEnum.configurations.sub.expense_configuration_expense_type.toString()}
          className="w-full px-4 pt-8"
        >
          <ExpenseTypeTab permissions={per} />
        </TabsContent>
      </Tabs>
    </>
  );
}
