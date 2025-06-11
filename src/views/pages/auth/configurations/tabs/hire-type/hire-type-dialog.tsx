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
import { HireTypeItem } from "@/database/tables";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";

export interface HireTypeDialogProps {
  onComplete: (hireType: HireTypeItem, edited: boolean) => void;
  hireType?: HireTypeItem;
}
export default function HireTypeDialog(props: HireTypeDialogProps) {
  const { onComplete, hireType } = props;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState({
    farsi: "",
    english: "",
    pashto: "",
    detail: "",
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`hire-types/${hireType?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
    setFetching(false);
  };
  useEffect(() => {
    if (hireType) fetch();
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
        id: hireType?.id,
        english: userData.english,
        farsi: userData.farsi,
        pashto: userData.pashto,
        detail: userData.detail,
      };

      const response = hireType
        ? await axiosClient.put("/hire-types", {
            ...form,
          })
        : await axiosClient.post("/hire-types", {
            ...form,
          });
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.hire_type, hireType ? true : false);
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
          {hireType ? t("edit") : t("add")}
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
        <CustomTextarea
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
