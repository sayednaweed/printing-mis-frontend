import { useContext, useMemo } from "react";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useTranslation } from "react-i18next";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { getConfiguration, validateFile } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import CheckListChooser from "@/components/custom-ui/chooser/CheckListChooser";
import { FileType } from "@/lib/types";
import {
  ChecklistEnum,
  ChecklistTypeEnum,
  HireTypeEnum,
  NidTypeEnum,
} from "@/lib/constants";

export default function AddExpensePayment() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const { t } = useTranslation();
  useScrollToElement(error);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };

  const hireTypeDuration = useMemo(() => {
    if (
      userData?.hire_type &&
      userData?.hire_type.id != HireTypeEnum.permanent
    ) {
      return (
        <>
          <CustomDatePicker
            placeholder={t("select_a_date")}
            lable={t("start_date")}
            requiredHint={`* ${t("required")}`}
            required={true}
            value={userData.start_date}
            dateOnComplete={(date: DateObject) => {
              setUserData((prev: any) => ({ ...prev, start_date: date }));
            }}
            className="py-3 w-full"
            errorMessage={error.get("start_date")}
          />
          <CustomDatePicker
            placeholder={t("select_a_date")}
            lable={t("end_date")}
            requiredHint={`* ${t("required")}`}
            required={true}
            value={userData.end_date}
            dateOnComplete={(date: DateObject) => {
              setUserData((prev: any) => ({ ...prev, end_date: date }));
            }}
            className="py-3 w-full"
            errorMessage={error.get("end_date")}
          />
        </>
      );
    }
    return undefined;
  }, [userData.hire_type]);
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
  }, [userData.identity_card]);
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev: any) => ({ ...prev, identity_card: selection }))
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
          setUserData((prev: any) => ({ ...prev, education_level: selection }))
        }
        lable={t("education_level")}
        selectedItem={userData["education_level"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("education_level")}
        apiUrl={"education-levels"}
        mode="single"
        cacheData={false}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["hire_type"]: selection })
        }
        lable={t("hire_type")}
        selectedItem={userData["hire_type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("hire_type")}
        apiUrl={"hire-types"}
        mode="single"
        cacheData={false}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("overtime_rate")}
        placeholder={t("rate")}
        defaultValue={userData["overtime_rate"]}
        type="number"
        name="overtime_rate"
        required={true}
        requiredHint={`* ${t("required")}`}
        errorMessage={error.get("overtime_rate")}
        onChange={handleChange}
      />
      {hireTypeDuration}
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev: any) => ({ ...prev, department: selection }))
        }
        lable={t("department")}
        selectedItem={userData["department"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("department")}
        apiUrl={"departments"}
        mode="single"
        cacheData={false}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev: any) => ({ ...prev, position: selection }))
        }
        lable={t("position")}
        selectedItem={userData["position"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("position")}
        apiUrl={"positions"}
        mode="single"
        cacheData={false}
      />

      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("hire_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.hire_date}
        dateOnComplete={(date: DateObject) => {
          setUserData((prev: any) => ({ ...prev, hire_date: date }));
        }}
        className="py-3 w-full"
        errorMessage={error.get("hire_date")}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev: any) => ({ ...prev, currency: selection }))
        }
        lable={t("currency")}
        selectedItem={userData["currency"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("currency")}
        apiUrl={"currencies"}
        mode="single"
        cacheData={false}
      />
      <CustomInput
        size_="sm"
        dir="ltr"
        className="rtl:text-end"
        lable={t("salary")}
        placeholder={t("amount")}
        defaultValue={userData["salary"]}
        type="number"
        name="salary"
        required={true}
        requiredHint={`* ${t("required")}`}
        errorMessage={error.get("salary")}
        onChange={handleChange}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData((prev: any) => ({ ...prev, work_shift: selection }))
        }
        lable={t("work_shift")}
        selectedItem={userData["work_shift"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("work_shift")}
        apiUrl={"shifts"}
        mode="single"
        cacheData={false}
      />

      <CheckListChooser
        className="mt-6 pt-4"
        number={undefined}
        hasEdit={true}
        url={`${
          import.meta.env.VITE_API_BASE_URL
        }/api/v1/no/identifier/file/upload`}
        headers={{
          Authorization: "Bearer " + getConfiguration()?.token,
        }}
        name={t("attachment")}
        defaultFile={userData.attachment as FileType}
        uploadParam={{
          checklist_id: ChecklistEnum.employee_attachment,
          task_type: ChecklistTypeEnum.employee,
        }}
        accept={"application/pdf,image/jpeg,image/png,image/jpg"}
        onComplete={async (record: any) => {
          for (const element of record) {
            const checklist = element[element.length - 1];
            setUserData((prev: any) => ({ ...prev, attachment: checklist }));
          }
        }}
        onFailed={async (failed: boolean, response: any) => {
          if (failed) {
            if (response) {
              toast({
                toastType: "ERROR",
                description: response.data.message,
              });
              setUserData((prev: any) => ({ ...prev, attachment: undefined }));
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
    </div>
  );
}
