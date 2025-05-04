import { useTranslation } from "react-i18next";
import EditProfileInformation from "./steps/edit-profile-information";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, KeyRound } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";
import { EditProfilePassword } from "../general/edit-profile-password";
import UserProfileHeader from "../general/user-profile-header";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";

export default function UsersProfilePage() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });

  const selectedTabStyle = `rtl:text-xl-rtl ltr:text-lg-ltr relative w-[95%] bg-card-foreground/5 justify-start mx-auto ltr:py-2 rtl:py-[5px] data-[state=active]:bg-tertiary font-semibold data-[state=active]:text-primary-foreground gap-x-3`;

  return (
    <div className="flex flex-col gap-y-3 px-3 pb-12 mt-2">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("profile")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{user?.username}</BreadcrumbItem>
      </Breadcrumb>
      {/* Cards */}
      <Tabs
        dir={direction}
        defaultValue="Account"
        className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:gap-y-0"
      >
        <TabsList className="sm:min-h-[550px] h-fit pb-8 min-w-[300px] md:w-[300px] gap-y-4 items-start justify-start flex flex-col bg-card border">
          <UserProfileHeader
            profile_upload_url={"user/profile/picture-update"}
            profile_delete_url={"general/profile/info/update"}
          />
          <TabsTrigger
            className={`mt-6 rtl:text-2xl-rtl ltr:text-2xl-ltr  ${selectedTabStyle}`}
            value="Account"
          >
            <Database className="size-[18px]" />
            {t("account_information")}
          </TabsTrigger>
          <TabsTrigger
            className={`rtl:text-2xl-rtl ltr:text-2xl-ltr ${selectedTabStyle}`}
            value="password"
          >
            <KeyRound className="size-[18px]" />
            {t("update_account_password")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex-1 m-0" value="Account">
          <EditProfileInformation />
        </TabsContent>
        <TabsContent className="flex-1 m-0" value="password">
          <EditProfilePassword url="profile/change-password" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
