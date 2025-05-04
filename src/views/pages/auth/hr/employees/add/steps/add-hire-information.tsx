import { useContext } from "react";
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

export default function AddHireInformation() {
  const { userData, setUserData, error } = useContext(StepperContext);
  const { t } = useTranslation();
  useScrollToElement(error);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="flex flex-col mt-10 gap-y-3 w-full lg:w-[60%] 2xl:w-1/3">
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["position_type"]: selection })
        }
        lable={t("position_type")}
        selectedItem={userData["position_type"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("position_type")}
        apiUrl={"position-types"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["department"]: selection })
        }
        lable={t("department")}
        selectedItem={userData["department"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("department")}
        apiUrl={"destinations"}
        mode="single"
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) =>
          setUserData({ ...userData, ["job"]: selection })
        }
        lable={t("job")}
        selectedItem={userData["job"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("job")}
        apiUrl={"jobs"}
        mode="single"
      />

      <CustomDatePicker
        placeholder={t("select_a_date")}
        lable={t("hire_date")}
        requiredHint={`* ${t("required")}`}
        required={true}
        value={userData.hire_date}
        dateOnComplete={(date: DateObject) => {
          setUserData({ ...userData, hire_date: date });
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
          setUserData({ ...userData, ["currency"]: selection })
        }
        lable={t("currency")}
        selectedItem={userData["currency"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("currency")}
        apiUrl={"currencies"}
        mode="single"
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
          setUserData({ ...userData, ["shift"]: selection })
        }
        lable={t("shift")}
        selectedItem={userData["shift"]?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("shift")}
        apiUrl={"shifts"}
        mode="single"
      />

      <CheckListChooser
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
          checklist_id: 1,
          task_type: 1,
        }}
        accept={"application/pdf,image/jpeg,image/png,image/jpg"}
        onComplete={async (record: any) => {
          for (const element of record) {
            const checklist = element[element.length - 1];
            setUserData({
              ...userData,
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
              setUserData({
                ...userData,
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
    </div>
  );
}
