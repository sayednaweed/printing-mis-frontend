import { PortalEnum } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";
import { Coins, House, User } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function PortalNavigationText() {
  const { portal, setPortal, user } = useAuthStore();
  const { t } = useTranslation();

  const links = useMemo(() => {
    const portalMap = {
      "1": {
        icon: <User className="size-[14px] text-primary/60" />,
        label: t("hr"),
        portalEnum: PortalEnum.hr,
        portalNumber: 1,
      },
      "2": {
        icon: <House className="size-[14px] text-primary/60" />,
        label: t("warehouse"),
        portalEnum: PortalEnum.inventory,
        portalNumber: 2,
      },
      "3": {
        icon: <Coins className="size-[14px] text-primary/60" />,
        label: t("expenses"),
        portalEnum: PortalEnum.expense,
        portalNumber: 3,
      },
    } as const;

    return Object.entries(user.permissions).flatMap(([portalKey]) => {
      const data = portalMap[portalKey as keyof typeof portalMap];
      if (!data) return [];

      return (
        <div
          key={portalKey}
          onClick={() => setPortal(data.portalNumber)}
          className={cn(
            "ltr:px-2 rtl:px-4 bg-primary/5 rounded-md shadow-sm cursor-pointer flex items-center gap-x-2",
            portal === data.portalEnum &&
              "text-white bg-tertiary [&>*]:text-white"
          )}
        >
          {data.icon}
          {data.label}
        </div>
      );
    });
  }, [portal]);

  return (
    <div className="flex gap-x-4 lg:px-4 flex-grow self-center uppercase font-semibold ltr:text-[13px] text-primary/80 [&>div]:py-[2px] [&>div]:border">
      {links}
    </div>
  );
}
