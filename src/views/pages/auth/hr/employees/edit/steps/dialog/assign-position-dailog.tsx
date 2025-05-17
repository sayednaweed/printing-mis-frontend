import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PositionAssignment } from "@/database/tables";
import axiosClient from "@/lib/axois-client";
import { HireTypeEnum } from "@/lib/constants";
import { ValidateItem } from "@/validation/types";
import { validate } from "@/validation/validation";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { useParams } from "react-router";

interface AssignPositionDailogprops {
  onComplete: (item: PositionAssignment) => void;
  onClose: () => void;
}
export default function AssignPositionDailog(props: AssignPositionDailogprops) {
  const { onComplete, onClose } = props;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  let { id } = useParams();
  const [position, setPosition] = useState<any>([]);
  const [error, setError] = useState<Map<string, string>>(new Map());
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPosition({ ...position, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) {
        return;
      }

      setLoading(true);
      // 1. Validate form
      const valid: ValidateItem[] = [
        {
          name: "hire_type",
          rules: ["required"],
        },
        {
          name: "overtime_rate",
          rules: ["required"],
        },
        {
          name: "department",
          rules: ["required"],
        },
        {
          name: "position",
          rules: ["required"],
        },
        {
          name: "hire_date",
          rules: ["required"],
        },
        {
          name: "currency",
          rules: ["required"],
        },
        {
          name: "salary",
          rules: ["required"],
        },
        {
          name: "work_shift",
          rules: ["required"],
        },
        {
          name: "type",
          rules: ["required"],
        },
      ];

      if (position?.hire_type?.id != HireTypeEnum.permanent) {
        if (position?.start_date) {
          valid.push({
            name: "start_date",
            rules: ["required"],
          });
        }
        if (position?.end_date) {
          valid.push({
            name: "end_date",
            rules: ["required"],
          });
        }
      }

      const passed = await validate(
        [
          {
            name: "hire_type",
            rules: ["required"],
          },
          {
            name: "overtime_rate",
            rules: ["required"],
          },
          {
            name: "start_date",
            rules: ["required"],
          },
          {
            name: "end_date",
            rules: ["required"],
          },
          {
            name: "department",
            rules: ["required"],
          },
          {
            name: "position",
            rules: ["required"],
          },
          {
            name: "hire_date",
            rules: ["required"],
          },
          {
            name: "currency",
            rules: ["required"],
          },
          {
            name: "salary",
            rules: ["required"],
          },
          {
            name: "work_shift",
            rules: ["required"],
          },
          {
            name: "type",
            rules: ["required"],
          },
        ],
        position,
        setError
      );
      if (!passed) {
        setLoading(false);
        return;
      }
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.post("employee/assigment/change", {
        employee_id: id,
        hire_type_id: position?.hire_type?.id,
        overtime_rate: position?.overtime_rate,
        start_date:
          position?.start_date && position?.start_date?.toDate()?.toISOString(),
        end_date:
          position?.end_date && position?.end_date?.toDate()?.toISOString(),
        department_id: position?.department?.id,
        position_id: position?.position?.id,
        hire_date: position?.hire_date?.toDate()?.toISOString(),
        currency_id: position?.currency?.id,
        salary: position?.salary,
        shift_id: position?.work_shift?.id,
        position_change_type_id: position?.type?.id,
      });
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data);
        onClose();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const hireTypeDuration = useMemo(() => {
    if (
      position?.hire_type &&
      position?.hire_type.id != HireTypeEnum.permanent
    ) {
      return (
        <>
          <CustomDatePicker
            placeholder={t("select_a_date")}
            lable={t("start_date")}
            requiredHint={`* ${t("required")}`}
            required={true}
            value={position.start_date}
            dateOnComplete={(date: DateObject) => {
              setPosition({ ...position, start_date: date });
            }}
            className="py-3 w-full"
            errorMessage={error.get("start_date")}
          />
          <CustomDatePicker
            placeholder={t("select_a_date")}
            lable={t("end_date")}
            requiredHint={`* ${t("required")}`}
            required={true}
            value={position.end_date}
            dateOnComplete={(date: DateObject) => {
              setPosition({ ...position, end_date: date });
            }}
            className="py-3 w-full"
            errorMessage={error.get("end_date")}
          />
        </>
      );
    }
    return undefined;
  }, [position?.hire_type]);
  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      {loading ? (
        <NastranSpinner className="mt-4" />
      ) : (
        <>
          <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
            <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
              {t("promote_or_demote")}
            </CardTitle>
          </CardHeader>
          <CardContent className=" pt-6 flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setPosition({ ...position, ["type"]: selection })
              }
              lable={t("type")}
              selectedItem={position["type"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("type")}
              apiUrl={"position/change-types"}
              mode="single"
              cacheData={false}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setPosition({ ...position, ["hire_type"]: selection })
              }
              lable={t("hire_type")}
              selectedItem={position["hire_type"]?.name}
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
              defaultValue={position["overtime_rate"]}
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
                setPosition({ ...position, ["department"]: selection })
              }
              lable={t("department")}
              selectedItem={position["department"]?.name}
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
                setPosition({ ...position, ["position"]: selection })
              }
              lable={t("position")}
              selectedItem={position["position"]?.name}
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
              value={position.hire_date}
              dateOnComplete={(date: DateObject) => {
                setPosition({ ...position, hire_date: date });
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
                setPosition({ ...position, ["currency"]: selection })
              }
              lable={t("currency")}
              selectedItem={position["currency"]?.name}
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
              defaultValue={position["salary"]}
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
                setPosition({ ...position, ["work_shift"]: selection })
              }
              lable={t("work_shift")}
              selectedItem={position["work_shift"]?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("work_shift")}
              apiUrl={"shifts"}
              mode="single"
              cacheData={false}
            />
          </CardContent>
          <CardFooter className="flex justify-evenly items-center mt-12">
            <PrimaryButton
              disabled={loading}
              onClick={store}
              className={`shadow-lg`}
            >
              {t("confirm")}
            </PrimaryButton>
            <PrimaryButton
              className="rounded-md min-w-[80px] shadow-md rtl:text-xl-rtl bg-red-500 hover:bg-red-500"
              onClick={onClose}
            >
              {t("cancel")}
            </PrimaryButton>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
