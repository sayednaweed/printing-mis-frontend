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
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import { setServerError, validate } from "@/validation/validation";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { Leave } from "@/database/tables";
import { isString } from "@/lib/utils";

interface AddUpdateLeaveProps {
  onComplete: (leave: Leave) => void;
  leave?: Leave;
  onCloseModel?: () => void;
}

export default function AddUpdateLeave(props: AddUpdateLeaveProps) {
  const { onComplete, leave, onCloseModel } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [loading, setLoading] = useState(false);
  const closeModel = () => {
    if (onCloseModel) onCloseModel();
    modelOnRequestHide();
  };
  const [error, setError] = useState<Map<string, string>>(new Map());
  const [userData, setUserData] = useState<{
    hr_code: { id: string; name: string } | undefined;
    leave_type: { id: string; name: string } | undefined;
    start_date: DateObject;
    end_date: DateObject;
    reason: string;
  }>({
    hr_code: undefined,
    leave_type: undefined,
    start_date: new DateObject(new Date()),
    end_date: new DateObject(new Date()),
    reason: "",
  });
  const fetch = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`leaves/${leave?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (leave) fetch();
  }, []);
  const store = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "hr_code",
          rules: ["required"],
        },
        {
          name: "leave_type",
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
          name: "reason",
          rules: ["required", "min:5"],
        },
      ],

      userData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    try {
      const response = await axiosClient.post("leaves", {
        employee_id: userData.hr_code?.id,
        hr_code: userData.hr_code,
        status_id: userData.leave_type?.id,
        status: userData.leave_type?.name,
        reason: userData.reason,
        start_date: userData?.start_date?.toDate()?.toISOString(),
        end_date: userData?.end_date?.toDate()?.toISOString(),
      });
      if (response.status == 200) {
        onComplete(response.data?.leave);
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
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    // 1. Validate form
    const passed = await validate(
      [
        {
          name: "hr_code",
          rules: ["required"],
        },
        {
          name: "leave_type",
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
          name: "reason",
          rules: ["required", "min:5"],
        },
      ],

      userData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }
    // 2. Store
    try {
      const response = await axiosClient.put("leaves", {
        employee_id: userData.hr_code?.id,
        hr_code: userData.hr_code,
        status_id: userData.leave_type?.id,
        status: userData.leave_type?.name,
        reason: userData.reason,
        start_date: isString(userData?.start_date)
          ? userData?.start_date
          : userData?.start_date?.toDate()?.toISOString(),
        end_date: isString(userData?.end_date)
          ? userData?.end_date
          : userData?.end_date?.toDate()?.toISOString(),
      });
      if (response.status == 200) {
        onComplete(response.data?.leave);
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
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prev: any) => ({ ...prev, [name]: value }));
  };
  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      {loading ? (
        <NastranSpinner className="mt-4" />
      ) : (
        <>
          <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
            <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
              {t("take_leave")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center mt-4 gap-y-3">
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
              className="sm:min-w-[400px] w-fit"
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
                  leave_type: selection,
                }))
              }
              lable={t("leave_type")}
              selectedItem={userData?.leave_type?.name}
              placeHolder={t("select_a")}
              errorMessage={error.get("leave_type")}
              apiUrl={"leave-types"}
              mode="single"
              className="sm:min-w-[400px] w-fit"
              cacheData={false}
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("start_date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={userData.start_date}
              dateOnComplete={(date: DateObject) => {
                setUserData((prev: any) => ({
                  ...prev,
                  start_date: date,
                }));
              }}
              className="py-3 sm:min-w-[400px] w-full"
              errorMessage={error.get("start_date")}
            />
            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("end_date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={userData.end_date}
              dateOnComplete={(date: DateObject) => {
                setUserData((prev: any) => ({
                  ...prev,
                  end_date: date,
                }));
              }}
              className="py-3 sm:min-w-[400px] w-full"
              errorMessage={error.get("end_date")}
            />
            <CustomTextarea
              required={true}
              requiredHint={`* ${t("required")}`}
              placeholder={t("reason")}
              value={userData.reason}
              name="reason"
              rows={5}
              parantClassName=" col-span-3 mx-auto min-w-[100%] lg:min-w-[60%]"
              className=""
              errorMessage={error.get("reason")}
              onChange={handleChange}
            />
          </CardContent>
          <CardFooter className="flex justify-evenly items-center mt-12">
            <PrimaryButton
              disabled={loading}
              onClick={leave ? update : store}
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
