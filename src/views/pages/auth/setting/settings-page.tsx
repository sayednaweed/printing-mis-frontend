import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageTab from "./tabs/language/language-tab";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  return (
    <>
      <Breadcrumb className="mx-2 mt-2">
        <BreadcrumbHome />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("settings")}</BreadcrumbItem>
      </Breadcrumb>
      <Tabs
        dir={direction}
        defaultValue={"general"}
        className="flex flex-col items-center pb-12"
      >
        <TabsList className="px-0 pb-1 h-fit mt-2 flex-wrap overflow-x-auto overflow-y-hidden justify-center gap-y-1 gap-x-1">
          <TabsTrigger
            value={"general"}
            className="gap-x-1 bg-card shadow rtl:text-2xl-rtl ltr:text-xl-ltr data-[state=active]:bg-primary data-[state=active]:text-tertiary"
          >
            <Languages className="size-[16px] ltr:mr-1 rtl:ml-1" />
            {t("general")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={"general"}
          className="overflow-y-auto self-start w-full sm:w-1/2 xl:w-1/3"
        >
          <LanguageTab />
        </TabsContent>
      </Tabs>
    </>
  );
}
