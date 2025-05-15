import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import axiosClient from "@/lib/axois-client";
import { setServerError, validate } from "@/validation/validation";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { EmployeeMore, UserPermission } from "@/database/tables";
import {
  ChecklistEnum,
  ChecklistTypeEnum,
  NidTypeEnum,
  PermissionEnum,
} from "@/lib/constants";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { FileType } from "@/lib/types";
import { getConfiguration, validateFile } from "@/lib/utils";
import { ValidateItem } from "@/validation/types";
export interface EmployeeMoreTabProps {
  id: string | undefined;
  permissions: UserPermission;
}
export default function EmployeeMoreTab(props: EmployeeMoreTabProps) {
  const { id, permissions } = props;
  const [failed, setFailed] = useState(false);
  const [userData, setUserData] = useState<EmployeeMore | undefined>(undefined);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  useScrollToElement(error);
  const handleChange = (e: any) => {
    if (userData) {
      const { name, value } = e.target;
      setUserData((prev: any) => ({ ...prev, [name]: value }));
    }
  };
  const loadInformation = async () => {
    try {
      const response = await axiosClient.get(`employee/more/details/${id}`);
      if (response.status == 200) {
        setUserData(response.data.employee);
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
  const saveData = async () => {
    if (loading || userData === undefined || id === undefined) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // 1. Validate form
    const validationRules: ValidateItem[] = [
      {
        name: "id",
        rules: ["required"],
      },
      { name: "identity_card", rules: ["required"] },
      { name: "register_no", rules: ["required"] },
      { name: "education_level", rules: ["required"] },
    ];
    if (userData?.identity_card?.id == NidTypeEnum.paper_id_card) {
      if (!userData?.register) {
        validationRules.push({ name: "register", rules: ["required"] });
      }
      if (!userData?.volume) {
        validationRules.push({ name: "volume", rules: ["required"] });
      }
      if (!userData?.page) {
        validationRules.push({ name: "page", rules: ["required"] });
      }
    }
    const passed = await validate(validationRules, userData, setError);
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    try {
      const response = await axiosClient.post("employee/update/more/details", {
        id: id,
      });
      if (response.status == 200) {
        // Update user state
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(userData);
  const hasEdit = permissions.sub.get(
    PermissionEnum.employees.sub.personal_information
  )?.edit;
  const nid_details = useMemo(() => {
    if (
      userData?.identity_card &&
      userData?.identity_card?.id == NidTypeEnum.paper_id_card
    ) {
      return (
        <>
          <CustomInput
            size_="sm"
            dir="ltr"
            className="rtl:text-end"
            lable={t("register")}
            placeholder={t("enter")}
            defaultValue={userData["register"]}
            type="text"
            name="register"
            required={true}
            requiredHint={`* ${t("required")}`}
            errorMessage={error.get("register")}
            onChange={handleChange}
          />
          <CustomInput
            size_="sm"
            dir="ltr"
            className="rtl:text-end"
            lable={t("volume")}
            placeholder={t("enter")}
            defaultValue={userData["volume"]}
            type="text"
            name="volume"
            required={true}
            requiredHint={`* ${t("required")}`}
            errorMessage={error.get("volume")}
            onChange={handleChange}
          />
          <CustomInput
            size_="sm"
            dir="ltr"
            className="rtl:text-end"
            lable={t("page")}
            placeholder={t("enter")}
            defaultValue={userData["page"]}
            type="text"
            name="page"
            required={true}
            requiredHint={`* ${t("required")}`}
            errorMessage={error.get("page")}
            onChange={handleChange}
          />
        </>
      );
    }
    return undefined;
  }, [userData?.identity_card]);
  return (
    <Card className="rounded-none rounded-b-xl">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-x-4 gap-y-6 w-full lg:w-[70%] 2xl:w-1/2 pb-16">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : userData === undefined ? (
          <NastranSpinner />
        ) : (
          <>
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  identity_card: selection,
                }))
              }
              lable={t("identity_card")}
              selectedItem={userData["identity_card"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("identity_card")}
              apiUrl={"nid/types"}
              mode="single"
              cacheData={false}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              className="rtl:text-end"
              lable={t("register_no")}
              placeholder={t("enter")}
              defaultValue={userData["register_no"]}
              type="text"
              name="register_no"
              required={true}
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("register_no")}
              onChange={handleChange}
            />
            {nid_details}
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  education_level: selection,
                }))
              }
              lable={t("education_level")}
              selectedItem={userData["education_level"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("education_level")}
              apiUrl={"education-levels"}
              mode="single"
              cacheData={false}
            />
            <CheckListChooser
              className="mt-6 pt-4"
              number={undefined}
              hasEdit={true}
              url={`${import.meta.env.VITE_API_BASE_URL}/api/v1/file/upload`}
              headers={{
                Authorization: "Bearer " + getConfiguration()?.token,
              }}
              name={t("attachment")}
              defaultFile={userData.attachment as FileType}
              uploadParam={{
                checklist_id: ChecklistEnum.employee_attachment,
                task_type: ChecklistTypeEnum.employee,
                unique_identifier: id,
              }}
              accept={"application/pdf,image/jpeg,image/png,image/jpg"}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const checklist = element[element.length - 1];

                  setUserData((prev: any) => ({
                    ...prev,
                    attachment: checklist,
                  }));
                }
              }}
              onFailed={async (failed: boolean, response: any) => {
                if (failed) {
                  if (response) {
                    toast({
                      toastType: "ERROR",
                      description: response.data.message,
                    });
                    setUserData((prev: any) => ({
                      ...prev,
                      attachment: undefined,
                    }));
                  }
                }
              }}
              onStart={async (_file: File) => {}}
              validateBeforeUpload={function (file: File): boolean {
                const maxFileSize = 3 * 1024 * 1024; // 3MB
                const resultFile = validateFile(
                  file,
                  Math.round(maxFileSize),
                  ["application/pdf", "image/jpeg", "image/png", "image/jpg"],
                  t
                );
                return resultFile ? true : false;
              }}
            />
          </>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => {
              setFailed(false);
              await loadInformation();
            }}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          userData &&
          hasEdit && (
            <PrimaryButton
              disabled={loading}
              onClick={saveData}
              className={`shadow-lg`}
            >
              <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
            </PrimaryButton>
          )
        )}
      </CardFooter>
    </Card>
  );
}
