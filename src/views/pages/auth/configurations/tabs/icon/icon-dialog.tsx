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
import { Icon } from "@/database/tables";
import FileChooser from "@/components/custom-ui/chooser/FileChooser";
import { isFile } from "@/validation/utils";

export interface IconDialogProps {
  onComplete: (icon: Icon, edited: boolean) => void;
  icon?: Icon;
}
export default function IconDialog(props: IconDialogProps) {
  const { onComplete, icon } = props;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<{
    id: string;
    farsi: string;
    english: string;
    pashto: string;
    icon: File | undefined;
  }>({
    id: "",
    farsi: "",
    english: "",
    pashto: "",
    icon: undefined,
  });
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const fetch = async () => {
    try {
      setFetching(true);
      const response = await axiosClient.get(`icons/${icon?.id}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error: any) {
      console.log(error);
    }
    setFetching(false);
  };

  useEffect(() => {
    if (icon) fetch();
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
        { name: "icon", rules: ["required"] },
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
      formData.append("english", userData.english);
      formData.append("farsi", userData.farsi);
      formData.append("pashto", userData.pashto);
      if (isFile(userData?.icon)) formData.append("icon", userData.icon);
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const response = icon
        ? await axiosClient.put("/icons", formData, config)
        : await axiosClient.post("/icons", formData, config);
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.icon, icon ? true : false);
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
          {icon ? t("edit") : t("add")}
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
        <FileChooser
          parentClassName="my-7"
          required={true}
          requiredHint={`* ${t("required")}`}
          errorMessage={error.get("icon")}
          lable={t("icon")}
          defaultFile={userData.icon}
          maxSize={0.01}
          accept=".svg"
          loading={fetching}
          validTypes={["image/svg+xml"]}
          onchange={async (file: File | undefined) => {
            setUserData({ ...userData, icon: file });
          }}
          routeIdentifier={"public"}
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
