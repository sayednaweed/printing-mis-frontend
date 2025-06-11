import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Grip } from "lucide-react";
import { Party, UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";

export default function AccountEditPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate("/dashboard", { replace: true });
  const { t, i18n } = useTranslation();
  let { id } = useParams();
  const direction = i18n.dir();
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<Party | undefined>();
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`sellers/${id}`);
      if (response.status == 200) {
        const data = response.data.party as Party;
        setUserData(data);
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
  const tabStyle =
    "data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] flex items-center gap-x-4 h-full rounded-none";

  const per: UserPermission = user?.permissions[PortalEnum.inventory].get(
    PermissionEnum.accounts.name
  ) as UserPermission;

  const tabList = useMemo(() => {
    // if (!userData)
    //   return (
    //     <>
    //       <Shimmer className=" mx-auto size-[86px] mt-6 rounded-full" />
    //       <Shimmer className="h-[32px] !mt-2 !mb-4 w-1/2 mx-auto rounded-sm" />
    //       <Shimmer className="h-24 w-[80%] mx-auto rounded-sm" />
    //       <Shimmer className="h-[32px] w-full rounded-sm" />
    //       <Shimmer className="h-[32px] w-full rounded-sm" />
    //     </>
    //   );
    return (
      <>
        {Array.from(per.sub).map(([key, _subPermission], index: number) => {
          return key == PermissionEnum.accounts.sub.detail ? (
            <TabsTrigger
              key={index}
              value={PermissionEnum.accounts.sub.detail.toString()}
              className={tabStyle}
            >
              <Database className="size-[16px]" />
              {t("detail")}
            </TabsTrigger>
          ) : key == PermissionEnum.accounts.sub.purchases ? (
            <TabsTrigger
              key={index}
              value={PermissionEnum.accounts.sub.purchases.toString()}
              className={tabStyle}
            >
              <Grip className="size-[16px]" />
              {t("purchases")}
            </TabsTrigger>
          ) : key == PermissionEnum.accounts.sub.sales ? (
            <TabsTrigger
              key={index}
              value={PermissionEnum.accounts.sub.sales.toString()}
              className={tabStyle}
            >
              <Grip className="size-[16px]" />
              {t("sales")}
            </TabsTrigger>
          ) : key == PermissionEnum.accounts.sub.expenses ? (
            <TabsTrigger
              key={index}
              value={PermissionEnum.accounts.sub.expenses.toString()}
              className={tabStyle}
            >
              <Grip className="size-[16px]" />
              {t("expenses")}
            </TabsTrigger>
          ) : key == PermissionEnum.accounts.sub.salaries ? (
            <TabsTrigger
              key={index}
              value={PermissionEnum.accounts.sub.salaries.toString()}
              className={tabStyle}
            >
              <Grip className="size-[16px]" />
              {t("salaries")}
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
        <BreadcrumbItem onClick={handleGoBack}>{t("accounts")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {userData?.company_name}
        </BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.accounts.sub.detail.toString()}
        className="flex flex-col"
      >
        <TabsList className="overflow-x-auto overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none rounded-t-lg shadow-sm border">
          {tabList}
        </TabsList>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.accounts.sub.detail.toString()}
        >
          <div></div>
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.accounts.sub.purchases.toString()}
        >
          <div></div>
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.accounts.sub.sales.toString()}
        >
          <div></div>
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.accounts.sub.expenses.toString()}
        >
          <div></div>
        </TabsContent>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.accounts.sub.salaries.toString()}
        >
          <div></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
