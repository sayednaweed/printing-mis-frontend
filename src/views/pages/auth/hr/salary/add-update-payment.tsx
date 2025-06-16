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
import { AttendanceModel } from "@/database/tables";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { DateObject } from "react-multi-date-picker";
import { valueIsNumber } from "@/lib/utils";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import CustomMultiDatePicker from "@/components/custom-ui/DatePicker/CustomMultiDatePicker";
import { validate } from "@/validation/validation";
import CachedImage from "@/components/custom-ui/image/CachedImage";

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
  const [details, setDetails] = useState<
    | { overtime: string; salary: string; profile: string; remaining: number }
    | undefined
  >(undefined);
  const getEmployeeDetail = async (employeeId: string) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        "salaries/employee-payment/" + employeeId
      );
      if (response.status === 200) {
        const data = response.data?.data;
        data.remaining = 0;
        setDetails(data);
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
      const response = await axiosClient.post("attendancies", {});
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
            {details && (
              <div className="grid grid-cols-[auto_1fr] bg-primary/5 mb-4 justify-start text-start gap-x-12 px-4 shadow-sm pb-4 pt-2 rounded-lg border col-span-full">
                <CachedImage
                  src={details?.profile}
                  alt="Avatar"
                  shimmerClassName="size-[86px] mx-auto col-span-full !mb-6 mx-auto shadow-lg border border-primary/30 rounded-full"
                  className="size-[86px] col-span-full !mb-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
                  routeIdentifier={"profile"}
                />
                <h1 className="text-primary font-bold border-b">
                  {t("overtime_rate")}:
                </h1>
                <h1>{details.overtime}</h1>
                <h1 className="text-primary font-bold">{t("salary")}:</h1>
                <h1>{details.salary}</h1>
                <h1 className="text-primary font-bold">{t("remaining")}:</h1>
                <h1>{details.remaining}</h1>
              </div>
            )}

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) => {
                setUserData((prev: any) => ({
                  ...prev,
                  hr_code: selection,
                }));
                getEmployeeDetail(selection?.id);
              }}
              lable={t("hr_code")}
              selectedItem={userData?.hr_code?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("hr_code")}
              apiUrl={"hr/codes"}
              mode="single"
              cacheData={false}
            />
            {details && (
              <>
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
                  lable={t("payment_date")}
                  requiredHint={`* ${t("required")}`}
                  required={true}
                  value={userData.payment_date}
                  dateOnComplete={(selectedDates: DateObject[]) => {
                    setUserData((prev: any) => ({
                      ...prev,
                      payment_date: selectedDates,
                    }));
                  }}
                  className="py-3 w-full"
                  errorMessage={error.get("date")}
                  singleSelect={true}
                />
                <CustomInput
                  size_="sm"
                  lable={t("overtime_h")}
                  placeholder={t("enter")}
                  defaultValue={userData["overtime_h"]}
                  type="text"
                  name="overtime_h"
                  requiredHint={`* ${t("required")}`}
                  errorMessage={error.get("overtime_h")}
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
                  apiUrl={"accounts-names"}
                  mode="single"
                  cacheData={false}
                />
                <CustomInput
                  size_="sm"
                  lable={t("payment_amount")}
                  placeholder={t("enter")}
                  defaultValue={userData["payment_amount"]}
                  type="text"
                  name="payment_amount"
                  requiredHint={`* ${t("required")}`}
                  errorMessage={error.get("payment_amount")}
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
              </>
            )}
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
