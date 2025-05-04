import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import LanguageChanger from "@/components/custom-ui/navbar/LanguageChanger";
export default function LanguageTab() {
  const { t } = useTranslation();

  const defaultLabelText = "rtl:text-2xl-rtl ltr:text-lg-ltr rtl:px-1";

  return (
    <section className="px-2 pt-2 select-none w-full">
      <div>
        <Label className={defaultLabelText}>{t("system_language")}</Label>
        <LanguageChanger className="rounded-md w-full" />
      </div>
    </section>
  );
}
