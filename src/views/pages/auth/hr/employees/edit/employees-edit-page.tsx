import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import EditUserInformation from "./steps/edit-user-information";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound, ShieldBan } from "lucide-react";
import { EmployeeModel, UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import EmployeesEditHeader from "./employees-edit-header";
import EditEmployeeInformation from "./steps/edit-employee-information";

export default function EmployeesEditPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<EmployeeModel | undefined>();
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`employee/${id}`);
      if (response.status == 200) {
        const user = response.data.employee as EmployeeModel;
        setUserData(user);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
      setFailed(true);
    }
  };
  useEffect(() => {
    loadInformation();
  }, []);

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;
  const per: UserPermission = user?.permissions[PortalEnum.hr].get(
    PermissionEnum.employees.name
  ) as UserPermission;

  const tableList = useMemo(() => {
    if (!userData) return null;
    return Array.from(per.sub).map(([key, _subPermission], index: number) => {
      return key == PermissionEnum.employees.sub.personal_information ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <Database className="size-[18px]" />
          {t("account_information")}
        </TabsTrigger>
      ) : key == PermissionEnum.employees.sub.promotion_demotion ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <KeyRound className="size-[18px]" />
          {t("promotion_demotion")}
        </TabsTrigger>
      ) : undefined;
    });
  }, []);
  return (
    <div className="flex flex-col gap-y-3 px-3 pt-2 overflow-x-auto pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("users")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {userData?.first_name + " " + userData?.last_name}
        </BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.users.sub.user_information.toString()}
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          {tableList ? (
            <>
              <EmployeesEditHeader
                id={id}
                failed={failed}
                userData={userData}
                setUserData={setUserData}
              />
              {tableList}
            </>
          ) : (
            <>
              <Shimmer className="shadow-none mx-auto size-[86px] mt-6 rounded-full" />
              <Shimmer className="h-[32px] shadow-none !mt-2 !mb-4 w-1/2 mx-auto rounded-sm" />
              <Shimmer className="h-24 shadow-none w-[80%] mx-auto rounded-sm" />
              <Shimmer className="h-[32px] shadow-none w-full rounded-sm" />
              <Shimmer className="h-[32px] shadow-none w-full rounded-sm" />
              <Shimmer className="h-[32px] shadow-none w-full rounded-sm" />
            </>
          )}
        </TabsList>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.users.sub.user_permission.toString()}
        >
          <EditEmployeeInformation permissions={per} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
