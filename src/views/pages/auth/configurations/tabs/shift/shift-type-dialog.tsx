import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { SimpleItem } from "@/database/tables";
import CustomTimePicker from "@/components/custom-ui/DatePicker/CustomTimePicker";
import { DateObject } from "react-multi-date-picker";

export interface ShiftDialogProps {
  onComplete: (shiftType: SimpleItem) => void;

  shift?: SimpleItem;
}
export default function LeaveTypeDialog(props: ShiftDialogProps) {
  const { onComplete, shift } = props;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState({
    farsi: "",
    english: "",
    pashto: "",
    start_time: new DateObject(),
    end_time: new DateObject(),
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`shift/type/${shift?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
    setFetching(false);
  };
  useEffect(() => {
    if (shift) fetch();
  }, []);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "english",
            rules: ["required"],
          },
          {
            name: "farsi",
            rules: ["required"],
          },
          {
            name: "pashto",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. Store
      let formData = new FormData();
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      const response = await axiosClient.post("leave/type/store", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.leave);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response.data.errors, setError);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const update = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 1. Validate form
      const passed = await validate(
        [
          {
            name: "english",
            rules: ["required"],
          },
          {
            name: "farsi",
            rules: ["required"],
          },
          {
            name: "pashto",
            rules: ["required"],
          },
          {
            name: "start_time",
            rules: ["required"],
          },
          {
            name: "end_time",
            rules: ["required"],
          },
        ],
        userData,
        setError
      );
      if (!passed) return;
      // 2. update
      let formData = new FormData();
      if (shift?.id) formData.append("id", shift.id);
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      const response = await axiosClient.post("shift/type/update", {
        start_time: userData?.start_time?.toDate()?.toISOString(),
      });
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.shift);
        modelOnRequestHide();
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

  return (
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {shift ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomInput
          size_="sm"
          dir="ltr"
          loading={fetching}
          className="rtl:text-end"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_en")}
          defaultValue={userData.english}
          type="text"
          name="english"
          errorMessage={error.get("english")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("en")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_fa")}
          defaultValue={userData.farsi}
          type="text"
          loading={fetching}
          name="farsi"
          errorMessage={error.get("farsi")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("fa")}
            </h1>
          }
        />
        <CustomInput
          size_="sm"
          loading={fetching}
          required={true}
          requiredHint={`* ${t("required")}`}
          placeholder={t("translate_ps")}
          defaultValue={userData.pashto}
          type="text"
          name="pashto"
          errorMessage={error.get("pashto")}
          onChange={handleChange}
          startContentDark={true}
          startContent={
            <h1 className="font-bold text-primary-foreground text-[11px] mx-auto">
              {t("ps")}
            </h1>
          }
        />
        <CustomTimePicker
          placeholder={t("select_time")}
          lable={t("start_time")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.start_time}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, start_time: date }));
          }}
          className="w-full mt-12"
          errorMessage={error.get("start_time")}
        />
        <CustomTimePicker
          placeholder={t("select_time")}
          lable={t("end_time")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.end_time}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, end_time: date }));
          }}
          className="w-full"
          errorMessage={error.get("end_time")}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          className="rtl:text-xl-rtl ltr:text-lg-ltr"
          variant="outline"
          onClick={modelOnRequestHide}
        >
          {t("cancel")}
        </Button>
        <PrimaryButton
          disabled={loading}
          onClick={shift ? update : store}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
