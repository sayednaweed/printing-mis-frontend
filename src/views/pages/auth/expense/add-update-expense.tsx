import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useState } from "react";
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
import { Expense } from "@/database/tables";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { DateObject } from "react-multi-date-picker";
import { valueIsNumber } from "@/lib/utils";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { validate } from "@/validation/validation";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";

interface AddUpdateExpenseProps {
  onComplete: (expense: Expense, edited: boolean) => void;
  expense?: Expense;
  onCloseModel?: () => void;
}

export default function AddUpdateExpense(props: AddUpdateExpenseProps) {
  const { onComplete, expense, onCloseModel } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [loading, setLoading] = useState(false);
  const closeModel = () => {
    if (onCloseModel) onCloseModel();
    modelOnRequestHide();
  };
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [userData, setUserData] = useState<any>([]);

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
      const response = await axiosClient.post("expenses", {});
      if (response.status == 200) {
        onComplete(response.data?.expense, expense ? true : false);
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
              {t("add_expense")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-4 gap-x-4 xl:gap-x-12 lg:items-baseline mt-4 gap-y-3 w-full lg:w-full">
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
            {userData?.expense_type?.id && (
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
            )}
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              onSelect={(selection: any) => {
                setUserData((prev: any) => ({
                  ...prev,
                  currency: selection,
                }));
              }}
              lable={t("currency")}
              selectedItem={userData?.currency?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("currency")}
              apiUrl={"currencies"}
              mode="single"
              cacheData={false}
            />
            {userData?.currency?.id && (
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
                apiUrl={"accounts/by/currency/" + userData?.currency?.id}
                mode="single"
                cacheData={false}
                key={userData?.currency?.id}
              />
            )}
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              onSelect={(selection: any) => {
                setUserData((prev: any) => ({
                  ...prev,
                  seller: selection,
                }));
              }}
              lable={t("seller")}
              selectedItem={userData?.seller?.name}
              placeHolder={t("select_a")}
              apiUrl={"parties"}
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
                  buyer: selection,
                }));
              }}
              lable={t("buyer")}
              selectedItem={userData?.buyer?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("buyer")}
              apiUrl={"hr/codes"}
              mode="single"
              cacheData={false}
            />
            <CustomInput
              size_="sm"
              lable={t("total_amount")}
              placeholder={t("enter")}
              value={userData["total_amount"] || ""}
              type="text"
              name="total_amount"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("total_amount")}
              onChange={handleNumberChange}
            />
            <CustomInput
              size_="sm"
              lable={t("payment_amount")}
              placeholder={t("enter")}
              value={userData["payment_amount"] || ""}
              type="text"
              name="payment_amount"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("payment_amount")}
              onChange={handleNumberChange}
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={userData.date}
              dateOnComplete={(date: DateObject) => {
                setUserData((prev: any) => ({ ...prev, date: date }));
              }}
              className="py-3 w-full"
              errorMessage={error.get("date")}
            />
            <CustomInput
              size_="sm"
              lable={t("bill_no")}
              placeholder={t("enter")}
              defaultValue={userData["bill_no"]}
              type="text"
              name="bill_no"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("bill_no")}
              onChange={handleChange}
            />
            <CustomTextarea
              parantClassName="col-span-full"
              rows={1}
              lable={t("file_no")}
              placeholder={t("enter")}
              defaultValue={userData["detail"]}
              name="file_no"
              requiredHint={`* ${t("required")}`}
              errorMessage={error.get("file_no")}
              onChange={handleChange}
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
