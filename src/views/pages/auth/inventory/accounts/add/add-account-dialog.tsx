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
import { useState } from "react";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { setServerError, validate } from "@/validation/validation";
import { Accounts } from "@/database/tables";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import MultiTabInput from "@/components/custom-ui/input/mult-tab/MultiTabInput";
import SingleTab from "@/components/custom-ui/input/mult-tab/parts/SingleTab";
import MultipleSelector from "@/components/custom-ui/select/MultipleSelector";
import { Option } from "@/lib/types";

export interface AddAccountDialogProps {
  onComplete: (account: Accounts) => void;
}
export default function AddAccountDialog(props: AddAccountDialogProps) {
  const { onComplete } = props;
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(new Map<string, string>());
  const [userData, setUserData] = useState<any>([]);
  const { modelOnRequestHide } = useModelOnRequestHide();
  const { t } = useTranslation();
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  const storeOrUpdate = async () => {
    if (loading) return;
    setLoading(true);

    const passed = await validate(
      [
        { name: "name_english", rules: ["required"] },
        { name: "name_farsi", rules: ["required"] },
        { name: "name_pashto", rules: ["required"] },
        { name: "code", rules: ["required"] },
        { name: "balance", rules: ["required"] },
        {
          name: "currency",
          rules: [
            (userData: any) => {
              if (userData?.currency?.length == 0) {
                return true;
              }
              return false;
            },
          ],
        },
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
        name_english: userData.name_english,
        name_farsi: userData.name_farsi,
        name_pashto: userData.name_pashto,
        code: userData.code,
        balance: userData?.balance,
        currency_id: userData.currency[0]?.id,
        detail: userData.detail,
      };

      const response = await axiosClient.post("/accounts", {
        ...form,
      });
      if (response.status === 200) {
        toast({ toastType: "SUCCESS", description: response.data.message });
        onComplete(response.data.account);
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
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      <CardHeader className="relative text-start">
        <CardTitle className="rtl:text-4xl-rtl ltr:text-3xl-ltr text-tertiary">
          {t("add")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-3">
        <MultiTabInput
          title={t("name")}
          parentClassName="w-full"
          optionalKey={"optional_lang"}
          onTabChanged={(key: string, tabName: string) => {
            setUserData({
              ...userData,
              [key]: tabName,
              optional_lang: tabName,
            });
          }}
          onChanged={(value: string, name: string) => {
            setUserData({
              ...userData,
              [name]: value,
            });
          }}
          name="name"
          highlightColor="bg-tertiary"
          userData={userData}
          errorData={error}
          placeholder={t("name")}
          className="rtl:text-xl-rtl"
          tabsClassName="gap-x-5"
        >
          <SingleTab>english</SingleTab>
          <SingleTab>farsi</SingleTab>
          <SingleTab>pashto</SingleTab>
        </MultiTabInput>
        <CustomInput
          required={true}
          lable={t("code")}
          requiredHint={`* ${t("required")}`}
          size_="sm"
          name="code"
          defaultValue={userData["code"]}
          placeholder={t("enter")}
          type="text"
          errorMessage={error.get("code")}
          onChange={handleChange}
        />
        <MultipleSelector
          popoverClassName=""
          onChange={(option: Option[]) => {
            setUserData({
              ...userData,
              currency: option,
            });
          }}
          // defaultOptions={frameworks}
          label={t("currency")}
          errorMessage={error.get("currency")}
          selectedOptions={userData.currency}
          required={true}
          requiredHint={`* ${t("Required")}`}
          apiUrl={"currencies"}
          placeholder={t("Select")}
          className="h-[50px] pt-1"
          emptyIndicator={<p className="text-center text-sm">{t("No item")}</p>}
          maxSelected={1}
        />
        <CustomInput
          required={true}
          lable={t("balance")}
          requiredHint={`* ${t("required")}`}
          size_="sm"
          name="balance"
          defaultValue={userData["balance"]}
          placeholder={t("enter")}
          type="text"
          errorMessage={error.get("balance")}
          onChange={handleChange}
        />
        <CustomTextarea
          required={true}
          placeholder={t("detail")}
          defaultValue={userData.detail}
          name="detail"
          onChange={handleChange}
          lable={t("detail")}
          rows={5}
          parantClassName="col-span-full"
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
