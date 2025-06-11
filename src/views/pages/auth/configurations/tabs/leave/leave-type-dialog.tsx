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
import { LeaveItem } from "@/database/tables";

export interface LeaveDialogProps {
  onComplete: (leaveType: LeaveItem, edited: boolean) => void;
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
  }>({
    farsi: "",
    english: "",
    pashto: "",
  });

  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();

  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`/leave-types/${leave?.id}`);
      if (response.status === 200) {
        const leave_type = response.data;
        setUserData(leave_type);
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
        id: leave?.id,
        english: userData.english,
        farsi: userData.farsi,
        pashto: userData.pashto,
      };

      const response = leave
        ? await axiosClient.put("/leave-types", {
            ...form,
          })
        : await axiosClient.post("/leave-types", {
            ...form,
          });
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.leave_type, leave ? true : false);
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
