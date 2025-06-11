import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import {
  Attendance,
  AttendanceModel,
  AttendanceStatus,
} from "@/database/tables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { valueIsNumber } from "@/lib/utils";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { validate } from "@/validation/validation";

interface AddUpdatePaymentProps {
  onComplete: (attendance: AttendanceModel) => void;
  attendance?: AttendanceModel;
  onCloseModel?: () => void;
}

export default function AddUpdatePayment(props: AddUpdatePaymentProps) {
  const { onComplete, attendance, onCloseModel } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [loading, setLoading] = useState(false);
  const closeModel = () => {
    if (onCloseModel) onCloseModel();
    modelOnRequestHide();
  };
  const [error, setError] = useState<Map<string, string>>(new Map());

  const [userData, setUserData] = useState<any>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const fetch = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("attendancies-show", {
        params: attendance?.created_at,
      });
      if (response.status === 200) {
        setAttendances(response.data.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("success"),
        description: error.response.data?.message,
      });
      modelOnRequestHide();
    }
    setLoading(false);
  };
  useEffect(() => {
    if (attendance) fetch();
  }, []);
  const store = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const passed = await validate(
      [{ name: "date", rules: ["required"] }],
      userData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }

    // 2. Store
    try {
      const list = attendances.map((item) => {
        let status_id = "0";
        item.status.forEach((status) => {
          if (status.selected == true) {
            status_id = status.id;
          }
        });
        return {
          hr_code: item.hr_code,
          description: item.detail,
          employee_id: item.id,
          status_type_id: status_id,
        };
      });
      const response = await axiosClient.post("attendancies", {
        attendances: list,
      });
      if (response.status == 200) {
        onComplete(response.data?.attendance);
        // Update user state
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
        closeModel();
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

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (valueIsNumber(value)) {
      setUserData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      {loading ? (
        <NastranSpinner className="mt-4" />
      ) : (
        <>
          <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
            <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
              {t("pay_salary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  hr_code: selection,
                }))
              }
              lable={t("hr_code")}
              selectedItem={userData?.hr_code?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("hr_code")}
              apiUrl={"hr/codes"}
              mode="single"
              cacheData={false}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  payment_type: selection,
                }))
              }
              lable={t("payment_type")}
              selectedItem={userData?.payment_type?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("payment_type")}
              apiUrl={"payment-types/names"}
              mode="single"
              cacheData={false}
            />
            <CustomMultiDatePicker
              placeholder={t("select_a_date")}
              lable={t("date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={userData.date}
              dateOnComplete={(selectedDates: DateObject[]) => {
                setUserData((prev: any) => ({ ...prev, date: selectedDates }));
              }}
              className="py-3 w-full"
              errorMessage={error.get("date")}
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  month: selection,
                }))
              }
              lable={t("month")}
              selectedItem={userData?.month?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("month")}
              apiUrl={"months"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  year: selection,
                }))
              }
              lable={t("year")}
              selectedItem={userData?.hr_code?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("year")}
              apiUrl={"years"}
              mode="single"
            />
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  currency: selection,
                }))
              }
              lable={t("currency")}
              selectedItem={userData?.currency?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("currency")}
              apiUrl={"currencies"}
              mode="single"
            />
            <CustomInput
              size_="sm"
              lable={t("overtime")}
              placeholder={t("enter")}
              defaultValue={userData["overtime"]}
              type="text"
              name="overtime"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("overtime")}
              onChange={handleNumberChange}
            />

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) =>
                setUserData((prev: any) => ({
                  ...prev,
                  account: selection,
                }))
              }
              lable={t("account")}
              selectedItem={userData?.account?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("account")}
              apiUrl={"accounts"}
              mode="single"
            />
            <CustomInput
              size_="sm"
              lable={t("payment")}
              placeholder={t("enter")}
              defaultValue={userData["payment"]}
              type="text"
              name="payment"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("payment")}
              onChange={handleNumberChange}
            />
            <CustomTextarea
              parantClassName="col-span-full"
              rows={5}
              lable={t("detail")}
              placeholder={t("enter")}
              defaultValue={userData["detail"]}
              name="detail"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("detail")}
              onChange={handleChange}
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
              onClick={closeModel}
            >
              {t("cancel")}
            </PrimaryButton>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
