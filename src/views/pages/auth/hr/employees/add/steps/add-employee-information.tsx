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

export default function AddEmployeeInformation() {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  useScrollToElement(error);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
      <CustomInput
        required={true}
        lable={t("first_name")}
        requiredHint={`* ${t("required")}`}
        size_="sm"
        name="first_name"
        defaultValue={userData["first_name"]}
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
        defaultValue={userData["last_name"]}
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
        defaultValue={userData["father_name"]}
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
        value={userData.date_of_birth}
        dateOnComplete={(date: DateObject) => {
          setUserData({ ...userData, date_of_birth: date });
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
        defaultValue={userData["contact"]}
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
        defaultValue={userData["email"]}
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
          setUserData({ ...userData, ["gender"]: selection })
        }
        lable={t("gender")}
        selectedItem={userData["gender"]?.name}
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
          setUserData({ ...userData, ["marital_status"]: selection })
        }
        lable={t("marital_status")}
        selectedItem={userData["marital_status"]?.name}
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
          setUserData({ ...userData, ["nationality"]: selection })
        }
        lable={t("nationality")}
        selectedItem={userData["nationality"]?.name}
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
            setUserData({
              ...userData,
              ["permanent_province"]: selection,
            })
          }
          lable={t("province")}
          required={true}
          requiredHint={`* ${t("required")}`}
          selectedItem={userData["permanent_province"]?.name}
          placeHolder={t("select_a")}
          errorMessage={error.get("permanent_province")}
          apiUrl={"provinces/" + CountryEnum.afghanistan}
          mode="single"
        />
        {userData.permanent_province && (
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setUserData({ ...userData, ["permanent_district"]: selection })
            }
            lable={t("permanent_district")}
            required={true}
            requiredHint={`* ${t("required")}`}
            selectedItem={userData["permanent_district"]?.name}
            placeHolder={t("select_a")}
            errorMessage={error.get("permanent_district")}
            apiUrl={"districts/" + userData?.permanent_province?.id}
            mode="single"
            key={userData?.permanent_province?.id}
          />
        )}

        {userData.permanent_district && (
          <CustomTextarea
            required={true}
            requiredHint={`* ${t("required")}`}
            lable={t("permanent_area")}
            name="permanent_area"
            defaultValue={userData["permanent_area"]}
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
            setUserData({
              ...userData,
              ["current_province"]: selection,
            })
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
              setUserData({ ...userData, ["current_district"]: selection })
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
    </div>
  );
}
