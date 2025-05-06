import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Mail, Phone, RefreshCcw, UserRound } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { getConfiguration, isString, validateFile } from "@/lib/utils";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { EmployeeModel, UserPermission } from "@/database/tables";
import {
  ChecklistEnum,
  ChecklistTypeEnum,
  CountryEnum,
  PermissionEnum,
} from "@/lib/constants";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { FileType } from "@/lib/types";
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
  const [tempUserData, setTempUserData] = useState<EmployeeModel | undefined>(
    userData
  );
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Map<string, string>>(new Map());
  useScrollToElement(error);
  useEffect(() => {
    setTempUserData(userData);
  }, [userData]);
  const handleChange = (e: any) => {
    if (tempUserData) {
      const { name, value } = e.target;
      setTempUserData({ ...tempUserData, [name]: value });
    }
  };
  const saveData = async () => {
    if (loading || tempUserData === undefined || id === undefined) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "id",
          rules: ["required"],
        },
        {
          name: "date_of_birth",
          rules: ["required"],
        },
        {
          name: "contact",
          rules: ["required"],
        },
        {
          name: "email",
          rules: ["required"],
        },
        {
          name: "permanent_province",
          rules: ["required"],
        },
        {
          name: "permanent_district",
          rules: ["required"],
        },
        {
          name: "permanent_area",
          rules: ["required"],
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
          name: "current_area",
          rules: ["required"],
        },
        {
          name: "nationality",
          rules: ["required"],
        },
        {
          name: "gender",
          rules: ["required"],
        },
        {
          name: "marital_status",
          rules: ["required"],
        },
        {
          name: "first_name",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "last_name",
          rules: ["required", "max:45", "min:3"],
        },
        {
          name: "father_name",
          rules: ["required", "max:45", "min:3"],
        },
      ],
      tempUserData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    try {
      const response = await axiosClient.post("employee/update/information", {
        id: id,
        date_of_birth: isString(tempUserData.date_of_birth)
          ? tempUserData.date_of_birth
          : tempUserData.date_of_birth?.toDate()?.toISOString(),
        contact: tempUserData.contact,
        email: tempUserData.email,
        permanent_province_id: tempUserData?.permanent_province?.id,
        permanent_district_id: tempUserData?.permanent_district?.id,
        permanent_area: tempUserData?.permanent_area,
        current_province_id: tempUserData?.current_province?.id,
        current_district_id: tempUserData?.current_district?.id,
        current_area: tempUserData?.current_area,
        gender_id: tempUserData?.gender?.id,
        marital_status_id: tempUserData?.marital_status?.id,
        first_name: tempUserData?.first_name,
        last_name: tempUserData?.last_name,
        father_name: tempUserData?.father_name,
        nationality_id: tempUserData?.nationality?.id,
        is_current_employee: tempUserData?.is_current_employee,
        has_attachment: userData?.attachment ? true : false,
      });
      if (response.status == 200) {
        // Update user state
        setUserData(tempUserData);
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

  const hasEdit = permissions.sub.get(
    PermissionEnum.employees.sub.personal_information
  )?.edit;
  return (
    <Card>
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
        ) : tempUserData === undefined ? (
          <NastranSpinner />
        ) : (
          <>
            <CustomInput
              required={true}
              lable={t("first_name")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="first_name"
              defaultValue={tempUserData["first_name"]}
              placeholder={t("enter_f_name")}
              type="text"
              errorMessage={error.get("first_name")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              required={true}
              lable={t("last_name")}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              name="last_name"
              defaultValue={tempUserData["last_name"]}
              placeholder={t("enter_l_name")}
              type="text"
              errorMessage={error.get("last_name")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              required={true}
              requiredHint={`* ${t("required")}`}
              size_="sm"
              lable={t("father_name")}
              name="father_name"
              defaultValue={tempUserData["father_name"]}
              placeholder={t("enter_fa_name")}
              type="text"
              errorMessage={error.get("father_name")}
              onBlur={handleChange}
              startContent={
                <UserRound className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("date_of_birth")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={tempUserData.date_of_birth}
              dateOnComplete={(date: DateObject) => {
                setTempUserData({ ...tempUserData, date_of_birth: date });
              }}
              className="py-3 w-full"
              errorMessage={error.get("date_of_birth")}
            />
            <CustomInput
              size_="sm"
              dir="ltr"
              className="rtl:text-end"
              lable={t("contact")}
              placeholder={t("enter_ur_pho_num")}
              defaultValue={tempUserData["contact"]}
              type="text"
              name="contact"
              required={true}
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("contact")}
              onChange={handleChange}
              startContent={
                <Phone className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <CustomInput
              size_="sm"
              name="email"
              required={true}
              lable={t("email")}
              defaultValue={tempUserData["email"]}
              placeholder={t("enter_your_email")}
              type="email"
              errorMessage={error.get("email")}
              onChange={handleChange}
              dir="ltr"
              className="rtl:text-right"
              startContent={
                <Mail className="text-tertiary size-[18px] pointer-events-none" />
              }
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["gender"]: selection })
              }
              lable={t("gender")}
              selectedItem={tempUserData["gender"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("gender")}
              apiUrl={"genders"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({
                  ...tempUserData,
                  ["marital_status"]: selection,
                })
              }
              lable={t("marital_status")}
              selectedItem={tempUserData["marital_status"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("marital_status")}
              apiUrl={"marital-statuses"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setTempUserData({ ...tempUserData, ["nationality"]: selection })
              }
              lable={t("nationality")}
              selectedItem={tempUserData["nationality"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("nationality")}
              apiUrl={"nationalities"}
              mode="single"
            />
            <BorderContainer
              title={t("permanent_address")}
              required={true}
              parentClassName="mt-3"
              className="flex flex-col items-start gap-y-3"
            >
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                onSelect={(selection: any) =>
                  setTempUserData({
                    ...tempUserData,
                    ["permanent_province"]: selection,
                  })
                }
                lable={t("province")}
                required={true}
                requiredHint={`* ${t("required")}`}
                selectedItem={tempUserData["permanent_province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("permanent_province")}
                apiUrl={"provinces/" + CountryEnum.afghanistan}
                mode="single"
              />
              {tempUserData.permanent_province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setTempUserData({
                      ...tempUserData,
                      ["permanent_district"]: selection,
                    })
                  }
                  lable={t("permanent_district")}
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  selectedItem={tempUserData["permanent_district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("permanent_district")}
                  apiUrl={"districts/" + tempUserData?.permanent_province?.id}
                  mode="single"
                  key={tempUserData?.permanent_province?.id}
                />
              )}

              {tempUserData.permanent_district && (
                <CustomTextarea
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  lable={t("permanent_area")}
                  name="permanent_area"
                  defaultValue={tempUserData["permanent_area"]}
                  placeholder={t("detail")}
                  errorMessage={error.get("permanent_area")}
                  onBlur={handleChange}
                  parantClassName=" min-w-full"
                  rows={5}
                />
              )}
            </BorderContainer>
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
                  setTempUserData({
                    ...tempUserData,
                    ["current_province"]: selection,
                  })
                }
                lable={t("province")}
                required={true}
                requiredHint={`* ${t("required")}`}
                selectedItem={tempUserData["current_province"]?.name}
                placeHolder={t("select_a")}
                errorMessage={error.get("current_province")}
                apiUrl={"provinces/" + CountryEnum.afghanistan}
                mode="single"
              />
              {tempUserData.current_province && (
                <APICombobox
                  placeholderText={t("search_item")}
                  errorText={t("no_item")}
                  onSelect={(selection: any) =>
                    setTempUserData({
                      ...tempUserData,
                      ["current_district"]: selection,
                    })
                  }
                  lable={t("current_district")}
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  selectedItem={tempUserData["current_district"]?.name}
                  placeHolder={t("select_a")}
                  errorMessage={error.get("current_district")}
                  apiUrl={"districts/" + tempUserData?.current_province?.id}
                  mode="single"
                  key={tempUserData?.current_province?.id}
                />
              )}

              {tempUserData.current_district && (
                <CustomTextarea
                  required={true}
                  requiredHint={`* ${t("required")}`}
                  lable={t("current_area")}
                  name="current_area"
                  defaultValue={tempUserData["current_area"]}
                  placeholder={t("detail")}
                  errorMessage={error.get("current_area")}
                  onBlur={handleChange}
                  parantClassName=" min-w-full"
                  rows={5}
                />
              )}
            </BorderContainer>
            <CustomCheckbox
              checked={tempUserData["is_current_employee"]}
              onCheckedChange={(value: boolean) =>
                setTempUserData({ ...tempUserData, is_current_employee: value })
              }
              parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
              text={t("is_current_employee")}
              description={t("is_current_employee_des")}
              required={true}
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("is_current_employee")}
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
              defaultFile={tempUserData.attachment as FileType}
              uploadParam={{
                checklist_id: ChecklistEnum.employee_attachment,
                task_type: ChecklistTypeEnum.employee,
                unique_identifier: id,
              }}
              accept={"application/pdf,image/jpeg,image/png,image/jpg"}
              onComplete={async (record: any) => {
                for (const element of record) {
                  const checklist = element[element.length - 1];
                  setTempUserData({
                    ...tempUserData,
                    attachment: checklist,
                  });
                }
              }}
              onFailed={async (failed: boolean, response: any) => {
                if (failed) {
                  if (response) {
                    toast({
                      toastType: "ERROR",
                      description: response.data.message,
                    });
                    setTempUserData({
                      ...tempUserData,
                      attachment: undefined,
                    });
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
            onClick={async () => await refreshPage()}
            className="bg-red-500 hover:bg-red-500/70"
          >
            {t("failed_retry")}
            <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
          </PrimaryButton>
        ) : (
          tempUserData &&
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
