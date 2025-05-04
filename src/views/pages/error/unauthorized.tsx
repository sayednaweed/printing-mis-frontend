import { ShieldBan } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
export default function Unauthorized() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <ShieldBan className=" text-red-500 size-[60px]" />
      <h1 className=" rtl:text-[36px] text-red-500">{t("unauthorized")}</h1>
      <h1
        onClick={() => navigate("/")}
        className="border py-4 px-5 rounded-md bg-primary/5 mt-4 shadow hover:shadow-sm rtl:text-xl-rtl"
      >
        {t("unauthorized_desc")}{" "}
        <span className="text-fourth cursor-pointer hover:opacity-70 rtl:text-xl-rtl font-bold">
          {t("click_here")}
        </span>
      </h1>
    </div>
  );
}
