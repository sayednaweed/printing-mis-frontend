import { Database, Grip } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { EmployeeModel, UserPermission } from "@/database/tables";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmployeeDetailTab from "./parts/employee-detail-tab";
import EmployeeMoreTab from "./parts/employee-more-tab";
export interface EditEmployeeInformationProps {
  id: string | undefined;
  failed: boolean;
  userData: EmployeeModel | undefined;
  setUserData: Dispatch<SetStateAction<EmployeeModel | undefined>>;
  refreshPage: () => Promise<void>;
  permissions: UserPermission;
}
export default function EditEmployeeInformation(
  props: EditEmployeeInformationProps
) {
  const { id, failed, userData, setUserData, refreshPage, permissions } = props;
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const tabStyle =
    "data-[state=active]:border-tertiary data-[state=active]:border-b-[2px] flex items-center gap-x-4 h-full rounded-none";

  return (
    <Tabs dir={direction} defaultValue={"detail"} className="flex flex-col">
      <TabsList className="overflow-x-auto overflow-y-hidden bg-card w-full justify-start p-0 m-0 rounded-none rounded-t-lg shadow-sm border">
        <TabsTrigger value={"detail"} className={tabStyle}>
          <Database className="size-[16px]" />
          {t("detail")}
        </TabsTrigger>
        <TabsTrigger value={"more"} className={tabStyle}>
          <Grip className="size-[16px]" />
          {t("more")}
        </TabsTrigger>
      </TabsList>
      <TabsContent className="flex-1 m-0" value={"detail"}>
        <EmployeeDetailTab
          permissions={permissions}
          id={id}
          failed={failed}
          userData={userData}
          setUserData={setUserData}
          refreshPage={refreshPage}
        />
      </TabsContent>
      <TabsContent className="flex-1 m-0" value={"more"}>
        <EmployeeMoreTab permissions={permissions} id={id} />
      </TabsContent>
    </Tabs>
  );
}
