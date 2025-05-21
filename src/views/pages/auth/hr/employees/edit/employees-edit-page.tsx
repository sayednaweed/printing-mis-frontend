import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
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
import EditEmployeeInformation from "./steps/edit-employee-information";
import EmployeesEditHeader from "./employees-edit-header";
import EditEmployeePromotionDemotion from "./steps/edit-employee-promotion-demotion";
import EditEmployeeStatus from "./steps/edit-employee-status";
import Downloader from "@/components/custom-ui/chooser/Downloader";

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

  const tabList = useMemo(() => {
    if (!userData)
      return (
        <>
          <Shimmer className=" mx-auto size-[86px] mt-6 rounded-full" />
          <Shimmer className="h-[32px] !mt-2 !mb-4 w-1/2 mx-auto rounded-sm" />
          <Shimmer className="h-24 w-[80%] mx-auto rounded-sm" />
          <Shimmer className="h-[32px] w-full rounded-sm" />
          <Shimmer className="h-[32px] w-full rounded-sm" />
          <Shimmer className="h-[32px] w-full rounded-sm" />
        </>
      );
    return (
      <>
        <EmployeesEditHeader
          id={id}
          failed={failed}
          userData={userData}
          setUserData={setUserData}
        />
        {Array.from(per.sub).map(([key, _subPermission], index: number) => {
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
          ) : key == PermissionEnum.employees.sub.employee_status ? (
            <TabsTrigger
              key={index}
              className={`${selectedTabStyle}`}
              value={key.toString()}
            >
              <KeyRound className="size-[18px]" />
              {t("employment_status")}
            </TabsTrigger>
          ) : undefined;
        })}
      </>
    );
  }, [userData]);

  return (
    <div className="flex flex-col gap-y-3 px-3 pt-2 pb-12">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("employees")}</BreadcrumbItem>
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
          {tabList}
          <Downloader
            downloadText={t("download_contract")}
            filetoDownload={{
              id: "",
              path: "",
              name: `${userData?.first_name + " " + userData?.last_name}.pdf`,
              extension: "application/pdf",
              size: 0,
            }}
            className="mx-auto my-auto border rounded-lg p-2 w-full bg-gray-300/15 hover:shadow transition-all duration-300 ease-in-out"
            errorText={t("error")}
            cancelText={t("cancel")}
            apiUrl={"generate/employee/contract/" + id}
          />
        </TabsList>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.employees.sub.personal_information.toString()}
        >
          <EditEmployeeInformation
            permissions={per}
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
            refreshPage={loadInformation}
          />
        </TabsContent>
        <TabsContent
          className="flex-1 m-0 overflow-x-auto"
          value={PermissionEnum.employees.sub.promotion_demotion.toString()}
        >
          <EditEmployeePromotionDemotion id={id} />
        </TabsContent>
        <TabsContent
          className="flex-1 m-0 overflow-x-auto"
          value={PermissionEnum.employees.sub.employee_status.toString()}
        >
          <EditEmployeeStatus permissions={per} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
