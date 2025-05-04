import { PortalEnum } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import { Coins, House, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PortalNavigationText() {
  const { portal, setPortal } = useAuthStore();
  const { t } = useTranslation();

  return (
    <div className="flex gap-x-4 ltr:mr-12 rtl:ml-12 self-center uppercase font-semibold ltr:text-[13px] text-primary [&>div]:py-[2px] [&>div]:border">
      <div
        onClick={() => setPortal(2)}
        className={cn(
          "ltr:px-2 rtl:px-4 rounded-md shadow-sm cursor-pointer flex items-center gap-x-2",
          portal == PortalEnum.inventory &&
            "text-white bg-tertiary [&>*]:text-white"
        )}
      >
        <House className="size-[14px] text-primary/60" />
        {t("warehouse")}
      </div>
      <div
        onClick={() => setPortal(1)}
        className={cn(
          "ltr:px-2 rtl:px-4 rounded-md shadow-sm cursor-pointer flex items-center gap-x-2",
          portal == PortalEnum.hr && "text-white bg-tertiary [&>*]:text-white"
        )}
      >
        <User className="size-[14px] text-primary/60" />
        {t("hr")}
      </div>
      <div
        onClick={() => setPortal(3)}
        className={cn(
          "ltr:px-2 rtl:px-4 rounded-md shadow-sm cursor-pointer flex items-center gap-x-2",
          portal == PortalEnum.expense &&
            "text-white bg-tertiary [&>*]:text-white"
        )}
      >
        <Coins className="size-[14px] text-primary/60" />
        {t("expenses")}
      </div>
    </div>
  );
}
