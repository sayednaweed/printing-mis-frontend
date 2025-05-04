import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import Stepper from "@/components/custom-ui/stepper/Stepper";
import CompleteStep from "@/components/custom-ui/stepper/CompleteStep";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { setServerError } from "@/validation/validation";
import { Check, Database, User as UserIcon } from "lucide-react";
import { checkStrength, passwordStrengthScore } from "@/validation/utils";
import { Employee } from "@/database/tables";
import AddEmployeeInformation from "./steps/add-employee-information";
import AddHireInformation from "./steps/add-hire-information";

export interface AddEmployeeProps {
  onComplete: (employee: Employee) => void;
}
export default function AddEmployee(props: AddEmployeeProps) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const beforeStepSuccess = async (
    userData: any,
    currentStep: number,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    if (currentStep == 1) {
      try {
        let formData = new FormData();
        formData.append("email", userData?.email);
        formData.append("contact", userData?.contact);
        const response = await axiosClient.post(
          "user/validate/email/contact",
          formData
        );
        if (response.status == 200) {
          const emailExist = response.data.email_found === true;
          const contactExist = response.data.contact_found === true;
          if (emailExist || contactExist) {
            const errMap = new Map<string, string>();
            if (emailExist) {
              errMap.set("email", `${t("email")} ${t("is_registered_before")}`);
            }
            if (contactExist) {
              errMap.set(
                "contact",
                `${t("contact")} ${t("is_registered_before")}`
              );
            }
            setError(errMap);
            return false;
          }
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
        return false;
      }
    }
    return true;
  };
  const stepsCompleted = async (
    userData: any,
    setError: Dispatch<SetStateAction<Map<string, string>>>
  ) => {
    try {
      const response = await axiosClient.post("", {
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        father_name: userData?.father_name,
        date_of_birth: userData?.date_of_birth?.toDate()?.toISOString(),
        contact: userData?.contact,
        gender_id: userData?.gender?.id,
        marital_status_id: userData?.marital_status?.id,
        nationality_id: userData?.nationality?.id,
        permanent_province_id: userData?.permanent_province?.id,
        permanent_district_id: userData?.permanent_district?.id,
        current_province_id: userData?.current_province?.id,
        current_district_id: userData?.current_district?.id,
        permanent_area: userData?.permanent_area,
        current_area: userData?.current_area,
        position_type_id: userData?.position_type?.id,
        department_id: userData?.department?.id,
        job_d: userData?.job?.id,
        hire_date: userData?.hire_date?.toDate()?.toISOString(),
        currency_id: userData?.currencies?.id,
        salary: userData?.salary,
        shift_id: userData?.shift?.id,
      });
      if (response.status == 200) {
        onComplete(response.data.user);
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message,
      });
      setServerError(error.response.data.errors, setError);
      console.log(error);
      return false;
    }
    return true;
  };
  const closeModel = () => {
    modelOnRequestHide();
  };

  return (
    <div className="pt-4">
      {/* Header */}
      <div className="flex px-1 py-1 fixed w-full justify-end">
        <CloseButton dismissModel={closeModel} />
      </div>
      {/* Body */}
      <Stepper
        isCardActive={true}
        size="wrap-height"
        className="bg-transparent dark:!bg-transparent"
        progressText={{
          complete: t("complete"),
          inProgress: t("in_progress"),
          pending: t("pending"),
          step: t("step"),
        }}
        loadingText={t("store_infor")}
        backText={t("back")}
        nextText={t("next")}
        confirmText={t("confirm")}
        steps={[
          {
            description: t("personal_details"),
            icon: <UserIcon className="size-[16px]" />,
          },
          {
            description: t("hire_information"),
            icon: <Database className="size-[16px]" />,
          },
          {
            description: t("complete"),
            icon: <Check className="size-[16px]" />,
          },
        ]}
        components={[
          {
            component: <AddEmployeeInformation />,
            validationRules: [
              { name: "first_name", rules: ["required", "max:45", "min:3"] },
              { name: "last_name", rules: ["required", "max:45", "min:3"] },
              { name: "father_name", rules: ["required", "max:45", "min:3"] },
              { name: "date_of_birth", rules: ["required"] },
              { name: "contact", rules: ["required"] },
              { name: "department", rules: ["required"] },
              { name: "gender", rules: ["required"] },
              { name: "marital_status", rules: ["required"] },
              { name: "nationality", rules: ["required"] },
              { name: "permanent_province", rules: ["required"] },
              { name: "permanent_district", rules: ["required"] },
              { name: "permanent_area", rules: ["required"] },
              { name: "current_province", rules: ["required"] },
              { name: "current_district", rules: ["required"] },
              { name: "current_area", rules: ["required"] },
            ],
          },
          {
            component: <AddHireInformation />,
            validationRules: [
              {
                name: "password",
                rules: [
                  (value: any) => {
                    const strength = checkStrength(value, t);
                    const score = passwordStrengthScore(strength);
                    if (score === 4) return true;
                    return false;
                  },
                ],
              },
              { name: "position_type", rules: ["required"] },
              { name: "department", rules: ["required"] },
              { name: "job", rules: ["required"] },
              { name: "hire_date", rules: ["required"] },
              { name: "currencies", rules: ["required"] },
              { name: "salary", rules: ["required"] },
              { name: "shift", rules: ["required"] },
            ],
          },
          {
            component: (
              <CompleteStep
                successText={t("congratulation")}
                closeText={t("close")}
                againText={t("again")}
                closeModel={closeModel}
                description={t("employee_acc_crea")}
              />
            ),
            validationRules: [],
          },
        ]}
        beforeStepSuccess={beforeStepSuccess}
        stepsCompleted={stepsCompleted}
      />
    </div>
  );
}
