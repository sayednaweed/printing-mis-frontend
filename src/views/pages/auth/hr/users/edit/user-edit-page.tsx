import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import EditUserInformation from "./steps/edit-user-information";
import { EditUserPassword } from "./steps/edit-user-password";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { UserInformation } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound, ShieldBan } from "lucide-react";
import UserEditHeader from "./user-edit-header";
import EditUserPermissions from "./steps/edit-user-permissions";
import { UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";

export default function UserEditPage() {
  const { user, portal } = useAuthStore();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<UserInformation | undefined>();
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`user/${id}`);
      if (response.status == 200) {
        const user = response.data.user as UserInformation;
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
  const per: UserPermission = user?.permissions[portal].get(
    PermissionEnum.users.name
  ) as UserPermission;

  const tableList = Array.from(per.sub).map(
    ([key, _subPermission], index: number) => {
      return key == PermissionEnum.users.sub.user_information ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <Database className="size-[18px]" />
          {t("account_information")}
        </TabsTrigger>
      ) : key == PermissionEnum.users.sub.user_password ? (
        <TabsTrigger
          key={index}
          className={`${selectedTabStyle}`}
          value={key.toString()}
        >
          <KeyRound className="size-[18px]" />
          {t("update_account_password")}
        </TabsTrigger>
      ) : (
        key == PermissionEnum.users.sub.user_permission && (
          <TabsTrigger
            key={index}
            className={`${selectedTabStyle}`}
            value={key.toString()}
          >
            <ShieldBan className="size-[18px]" />
            {t("update_account_permissions")}
          </TabsTrigger>
        )
      );
    }
  );
  return (
    <div className="flex flex-col gap-y-3 px-3 mt-2 overflow-x-auto pb-bottom">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>{t("users")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {userData?.username}
        </BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.users.sub.user_information.toString()}
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <UserEditHeader
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
          />
          {tableList}
        </TabsList>

        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.users.sub.user_information.toString()}
        >
          <EditUserInformation
            id={id}
            failed={failed}
            userData={userData}
            setUserData={setUserData}
            refreshPage={loadInformation}
            permissions={per}
          />
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.users.sub.user_password.toString()}
        >
          <EditUserPassword
            id={id}
            userData={userData}
            failed={failed}
            refreshPage={loadInformation}
            permissions={per}
          />
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.users.sub.user_permission.toString()}
        >
          <EditUserPermissions permissions={per} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
