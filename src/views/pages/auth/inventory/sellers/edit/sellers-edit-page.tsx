import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
import { Party, UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import SellersEditHeader from "./sellers-edit-header";
import EditSellerInformation from "./steps/edit-seller-information";
import EditSellerTransaction from "./steps/edit-seller-transaction";

export default function SellersEditPage() {
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

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;
  const per: UserPermission = user?.permissions[PortalEnum.inventory].get(
    PermissionEnum.sellers.name
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
        </>
      );
    return (
      <>
        <SellersEditHeader
          id={id}
          failed={failed}
          userData={userData}
          setUserData={setUserData}
        />
        {Array.from(per.sub).map(([key, _subPermission], index: number) => {
          return key == PermissionEnum.sellers.sub.personal_information ? (
            <TabsTrigger
              key={index}
              className={`${selectedTabStyle}`}
              value={key.toString()}
            >
              <Database className="size-[18px]" />
              {t("detail")}
            </TabsTrigger>
          ) : key == PermissionEnum.sellers.sub.transactions ? (
            <TabsTrigger
              key={index}
              className={`${selectedTabStyle}`}
              value={key.toString()}
            >
              <KeyRound className="size-[18px]" />
              {t("transactions")}
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
        <BreadcrumbItem onClick={handleGoBack}>{t("sellers")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem onClick={handleGoBack}>
          {userData?.company_name}
        </BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue={PermissionEnum.sellers.sub.personal_information.toString()}
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          {tabList}
        </TabsList>
        <TabsContent
          className="flex-1 m-0"
          value={PermissionEnum.sellers.sub.personal_information.toString()}
        >
          <EditSellerInformation
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
          value={PermissionEnum.sellers.sub.transactions.toString()}
        >
          <EditSellerTransaction permissions={per} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
