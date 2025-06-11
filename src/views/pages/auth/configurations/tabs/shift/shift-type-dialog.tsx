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
import { Shift } from "@/database/tables";
import CustomTimePicker from "@/components/custom-ui/DatePicker/CustomTimePicker";
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";

export interface ShiftDialogProps {
  onComplete: (shift: Shift, edited: boolean) => void;
  shift?: Shift;
}
export default function ShiftDialog(props: ShiftDialogProps) {
  const { onComplete, shift } = props;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    id: string;
    farsi: string;
    english: string;
    pashto: string;
    check_in_start: DateObject | undefined;
    check_in_end: DateObject | undefined;
    check_out_start: DateObject | undefined;
    check_out_end: DateObject | undefined;
    detail: string;
  }>({
    id: "",
    farsi: "",
    english: "",
    pashto: "",
    check_in_start: undefined,
    check_in_end: undefined,
    check_out_start: undefined,
    check_out_end: undefined,
    detail: "",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`shifts/${shift?.id}`);
      if (response.status === 200) {
        const data = response.data;
        data.check_in_start = new DateObject(
          new Date("2025-06-03 " + data.check_in_start)
        );
        data.check_in_end = new DateObject(
          new Date("2025-06-03 " + data.check_in_end)
        );
        data.check_out_start = new DateObject(
          new Date("2025-06-03 " + data.check_out_start)
        );
        data.check_out_end = new DateObject(
          new Date("2025-06-03 " + data.check_out_end)
        );
        setUserData(data);
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
  const storeOrUpdate = async () => {
    if (loading) return;
    setLoading(true);

    const passed = await validate(
      [
        { name: "english", rules: ["required"] },
        { name: "farsi", rules: ["required"] },
        { name: "pashto", rules: ["required"] },
        { name: "check_in_start", rules: ["required"] },
        { name: "check_in_end", rules: ["required"] },
        { name: "check_out_start", rules: ["required"] },
        { name: "check_out_end", rules: ["required"] },
      ],
      userData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }

    try {
      const form = {
        id: shift?.id,
        english: userData.english,
        farsi: userData.farsi,
        pashto: userData.pashto,
        check_in_start: userData?.check_in_start?.format("HH:mm"),
        check_in_end: userData?.check_in_end?.format("HH:mm"),
        check_out_start: userData?.check_out_start?.format("HH:mm"),
        check_out_end: userData?.check_out_end?.format("HH:mm"),
        detail: userData.detail,
      };

      const response = shift
        ? await axiosClient.put("/shifts", {
            ...form,
          })
        : await axiosClient.post("/shifts", {
            ...form,
          });
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.shift, shift ? true : false);
        modelOnRequestHide();
      }
    } catch (error: any) {
      setServerError(error.response?.data?.errors, setError);
      toast({ toastType: "ERROR", description: error.response?.data?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-fit my-8 min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
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
          loading={fetching}
          placeholder={t("select_time")}
          lable={t("check_in_start")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.check_in_start}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, check_in_start: date }));
          }}
          className="w-full mt-12"
          errorMessage={error.get("check_in_start")}
        />
        <CustomTimePicker
          loading={fetching}
          placeholder={t("select_time")}
          lable={t("check_in_end")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.check_in_end}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, check_in_end: date }));
          }}
          className="w-full"
          errorMessage={error.get("check_in_end")}
        />
        <CustomTimePicker
          loading={fetching}
          placeholder={t("select_time")}
          lable={t("check_out_start")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.check_out_start}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, check_out_start: date }));
          }}
          className="w-full"
          errorMessage={error.get("check_out_start")}
        />
        <CustomTimePicker
          loading={fetching}
          placeholder={t("select_time")}
          lable={t("check_out_end")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={userData.check_out_end}
          dateOnComplete={(date: DateObject) => {
            setUserData((prev: any) => ({ ...prev, check_out_end: date }));
          }}
          className="w-full"
          errorMessage={error.get("check_out_end")}
        />
        <CustomTextarea
          required={true}
          placeholder={t("detail")}
          defaultValue={userData.detail}
          name="detail"
          onChange={handleChange}
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
          onClick={storeOrUpdate}
          className={`${loading && "opacity-90"}`}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
