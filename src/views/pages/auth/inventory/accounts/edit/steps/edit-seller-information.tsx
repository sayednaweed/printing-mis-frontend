import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Party, UserPermission } from "@/database/tables";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import {
  ChecklistEnum,
  ChecklistTypeEnum,
  CountryEnum,
  PermissionEnum,
} from "@/lib/constants";
import { RefreshCcw } from "lucide-react";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import { toast } from "@/components/ui/use-toast";
import { validate } from "@/validation/validation";
import axiosClient from "@/lib/axois-client";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { getConfiguration, validateFile } from "@/lib/utils";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { FileType } from "@/lib/types";
import CustomInput from "@/components/custom-ui/input/CustomInput";
export interface EditSellerInformationProps {
  id: string | undefined;
  failed: boolean;
  userData: Party | undefined;
  setUserData: Dispatch<SetStateAction<Party | undefined>>;
  refreshPage: () => Promise<void>;
  permissions: UserPermission;
}
export default function EditSellerInformation(
  props: EditSellerInformationProps
) {
  const { id, failed, userData, setUserData, refreshPage, permissions } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  useScrollToElement(error);
  const { t } = useTranslation();
  const hasEdit = permissions.sub.get(
    PermissionEnum.sellers.sub.personal_information
  )?.edit;
  const saveData = async () => {
    if (loading) {
      return;
    }
    const passed = await validate(
      [
        {
          name: "name",
          rules: ["required", "max:45", "min:2"],
        },
        {
          name: "current_province",
          rules: ["required"],
        },
        {
          name: "current_district",
          rules: ["required"],
        },
        {
          name: "company_name",
          rules: ["required", "max:45", "min:2"],
        },
        {
          name: "contact",
          rules: ["required"],
        },
        {
          name: "nationality",
          rules: ["required"],
        },
      ],
      userData,
      setError
    );
    if (!passed) {
      return;
    }
    setLoading(true);
    // 2. Store
    try {
      const response = await axiosClient.post("sellers", {
        id: id,
        name: userData?.name,
        company_name: userData?.company_name,
        contact: userData?.contact,
        email: userData?.email,
        nationality_id: userData?.nationality?.id,
        province_id: userData?.current_province?.id,
        district_id: userData?.current_district?.id,
        area: userData?.current_area,
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
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <Card className="rounded-none rounded-b-xl">
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_empl_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-x-4 gap-y-6 w-full lg:w-[70%] 2xl:w-1/2 pb-16">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : userData === undefined ? (
          <NastranSpinner />
        ) : (
          <>
            <CustomInput
              required={true}
              lable={t("name")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="name"
              defaultValue={userData["name"]}
              placeholder={t("enter")}
              type="text"
              errorMessage={error.get("name")}
              onChange={handleChange}
            />
            <CustomInput
              required={true}
              lable={t("company_name")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="company_name"
              defaultValue={userData["company_name"]}
              placeholder={t("enter")}
              type="text"
              errorMessage={error.get("company_name")}
              onChange={handleChange}
            />
            <CustomInput
              required={true}
              lable={t("contact")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="contact"
              defaultValue={userData["contact"]}
              placeholder={t("enter")}
              type="text"
              errorMessage={error.get("contact")}
              onChange={handleChange}
            />
            <CustomInput
              lable={t("email")}
              size_="sm"
              name="email"
              defaultValue={userData["email"]}
              placeholder={t("enter")}
              type="text"
              errorMessage={error.get("email")}
              onChange={handleChange}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  nationality: selection,
                }))
              }
              lable={t("nationality")}
              selectedItem={userData["nationality"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("nationality")}
              apiUrl={"nationalities"}
              mode="single"
            />

            <CheckListChooser
              className="mt-6 pt-4 w-full"
              number={undefined}
              hasEdit={true}
              url={`${
                import.meta.env.VITE_API_BASE_URL
              }/api/v1/no/identifier/file/upload`}
              headers={{
                Authorization: "Bearer " + getConfiguration()?.token,
              }}
              name={t("logo")}
              defaultFile={userData.logo as FileType}
              uploadParam={{
                checklist_id: ChecklistEnum.sellers_logo,
                task_type: ChecklistTypeEnum.sellers,
              }}
              accept={"application/pdf,image/jpeg,image/png,image/jpg"}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const checklist = element[element.length - 1];
                  setUserData((prev: any) => ({
                    ...prev,
                    logo: checklist,
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
                      logo: undefined,
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
                  ["image/jpeg", "image/png", "image/jpg"],
                  t
                );
                return resultFile ? true : false;
              }}
            />
            <BorderContainer
              title={t("currently_address")}
              required={true}
              parentClassName="mt-3"
              className="flex flex-col items-center gap-y-3"
            >
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setUserData((prev: any) => ({
                    ...prev,
                    current_province: selection,
                  }))
                }
                lable={t("province")}
                required={true}
                requiredHint={`* ${t("required")}`}
                selectedItem={userData["current_province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("current_province")}
                apiUrl={"provinces/" + CountryEnum.afghanistan}
                mode="single"
              />
              {userData.current_province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      current_district: selection,
                    }))
                  }
                  lable={t("current_district")}
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  selectedItem={userData["current_district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("current_district")}
                  apiUrl={"districts/" + userData?.current_province?.id}
                  mode="single"
                  key={userData?.current_province?.id}
                />
              )}

              {userData.current_district && (
                <CustomTextarea
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  lable={t("current_area")}
                  name="current_area"
                  defaultValue={userData["current_area"]}
                  placeholder={t("detail")}
                  errorMessage={error.get("current_area")}
                  onBlur={handleChange}
                  parantClassName=" min-w-full"
                  rows={5}
                />
              )}
            </BorderContainer>
          </>
        )}
      </CardContent>
      <CardFooter>
        {failed ? (
          <PrimaryButton
            onClick={async () => await refreshPage()}
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
