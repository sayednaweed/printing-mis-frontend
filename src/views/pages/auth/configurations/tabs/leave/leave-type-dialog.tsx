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
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { Textarea } from "@/components/ui/textarea";
import { LeaveItem } from "@/database/tables";

export interface LeaveDialogProps {
  onComplete: (leaveType: LeaveItem) => void;
  leave?: LeaveItem;
}

export default function LeaveTypeDialog({
  onComplete,
  leave,
}: LeaveDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(new Map<string, string>());

  const [userData, setUserData] = useState<{
    farsi: string;
    english: string;
    pashto: string;
    start_date?: string | DateObject;
    end_date?: string | DateObject;
    reason: string;
  }>({
    farsi: "",
    english: "",
    pashto: "",
    start_date: undefined,
    end_date: undefined,
    reason: "",
  });

  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`/leave-types/{id}/${leave?.id}`);
      if (response.status === 200) {
        const data = response.data;
        setUserData({
          ...data,
          start_date: data.start_date
            ? new DateObject(data.start_date)
            : undefined,
          end_date: data.end_date ? new DateObject(data.end_date) : undefined,
        });
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (leave) fetch();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const storeOrUpdate = async () => {
    if (loading) return;
    setLoading(true);

    const passed = await validate(
      [
        { name: "english", rules: ["required"] },
        { name: "farsi", rules: ["required"] },
        { name: "pashto", rules: ["required"] },
        { name: "start_date", rules: ["required"] },
        { name: "end_date", rules: ["required"] },
        { name: "reason", rules: ["required"] },
      ],
      userData,
      setError
    );
    if (!passed) {
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      if (leave?.id) formData.append("id", leave.id);
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      formData.append(
        "start_date",
        userData.start_date instanceof DateObject
          ? userData.start_date.format("YYYY-MM-DD")
          : ""
      );
      formData.append(
        "end_date",
        userData.end_date instanceof DateObject
          ? userData.end_date.format("YYYY-MM-DD")
          : ""
      );
      formData.append("reason", userData.reason);

      const response = await axiosClient.post("/leave-types", formData);
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.leave);
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
    <Card className="w-fit min-w-[400px] self-center [backdrop-filter:blur(20px)] bg-white/70 dark:!bg-black/40">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {leave ? t("edit") : t("add")}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CustomDatePicker
          requiredHint={`* ${t("required")}`}
          placeholder={t("select_str_date")}
          value={userData.start_date}
          dateOnComplete={(date: DateObject) =>
            setUserData((prev) => ({ ...prev, start_date: date }))
          }
          className="border p-3 hover:bg-black/5 transition-all duration-300 ease-in-out"
        />
        <CustomDatePicker
          requiredHint={`* ${t("required")}`}
          placeholder={t("select_end_date")}
          value={userData.end_date}
          dateOnComplete={(date: DateObject) =>
            setUserData((prev) => ({ ...prev, end_date: date }))
          }
          className="border p-3 mt-3 hover:bg-black/5 transition-all duration-300 ease-in-out"
        />

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

        <Textarea
          required={true}
          placeholder={t("reason")}
          className="mt-3"
          value={userData.reason}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, reason: e.target.value }))
          }
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
          className={loading ? "opacity-90" : ""}
          type="submit"
        >
          <ButtonSpinner loading={loading}>{t("save")}</ButtonSpinner>
        </PrimaryButton>
      </CardFooter>
    </Card>
  );
}
