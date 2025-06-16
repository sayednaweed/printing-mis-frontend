import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import BorderContainer from "@/components/custom-ui/container/BorderContainer";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import { CountryEnum } from "@/lib/constants";
import { Mail, Phone, UserRound } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";

export default function AddExpenseInfo() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  useScrollToElement(error);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) => {
          setUserData((prev: any) => ({
            ...prev,
            expense_type: selection,
          }));
        }}
        lable={t("expense_type")}
        selectedItem={userData?.expense_type?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("expense_type")}
        apiUrl={"expense-types"}
        mode="single"
        cacheData={false}
      />
      <APICombobox
        placeholderText={t("search_item")}
        errorText={t("no_item")}
        required={true}
        requiredHint={`* ${t("required")}`}
        onSelect={(selection: any) => {
          setUserData((prev: any) => ({
            ...prev,
            item: selection,
          }));
        }}
        lable={t("item")}
        selectedItem={userData?.item?.name}
        placeHolder={t("select_a")}
        errorMessage={error.get("item")}
        apiUrl={"expense-types/icons/" + userData?.expense_type?.id}
        mode="single"
        cacheData={false}
        key={userData?.expense_type?.id}
      />
    </div>
  );
}
