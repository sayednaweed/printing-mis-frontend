import { IUserPermission } from "@/lib/types";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import CustomCheckbox from "../checkbox/CustomCheckbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import PrimaryButton from "../button/PrimaryButton";
import { ChevronsUpDown } from "lucide-react";

export interface PermissionSubProps {
  permission: IUserPermission;
  mainActions: {
    view: (value: boolean, permission: string) => void;
    add: (value: boolean, permission: string) => void;
    edit: (value: boolean, permission: string) => void;
    delete: (value: boolean, permission: string) => void;
    singleRow: (value: boolean, permission: string) => void;
  };
  subActions: {
    view: (value: boolean, permission: string, subId: number) => void;
    add: (value: boolean, permission: string, subId: number) => void;
    edit: (value: boolean, permission: string, subId: number) => void;
    delete: (value: boolean, permission: string, subId: number) => void;
    singleRow: (value: boolean, permission: string, subId: number) => void;
  };
}
const PermissionSub = (props: PermissionSubProps) => {
  const { permission, subActions, mainActions } = props;
  const { t } = useTranslation();
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <PrimaryButton className="w-full mb-2 py-[18px] flex justify-between hover:bg-primary/5 hover:shadow-none hover:text-primary bg-transparent shadow-none border text-primary">
          {t(permission.permission)}
          <ChevronsUpDown className="h-4 w-4" />
          <span className="sr-only">Toggle</span>
        </PrimaryButton>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-3 lg:px-4 py-4 md:py-4 bg-primary/5 pb-4 mb-4 border hover:shadow transition-shadow ease-in-out rounded-xl shadow-sm">
        <div className="md:flex md:flex-wrap xl:grid md:space-y-2 xl:space-y-0 space-y-3 xl:grid-cols-6 mt-2 items-center border-b pb-3">
          <div className="col-span-2 w-full xl:w-fit flex justify-between items-center gap-x-2">
            <h1 className="rtl:text-2xl-rtl ltr:text-xl-ltr text-start font-bold text-tertiary">
              {t(permission.permission)}
            </h1>
            <CustomCheckbox
              parentClassName="space-x-1"
              checked={permission.singleRow}
              onCheckedChange={(value: boolean) =>
                mainActions["singleRow"](value, permission.permission)
              }
              text={t("select_row")}
            />
          </div>
          <CustomCheckbox
            text={t("add")}
            className="ml-1"
            checked={permission.add}
            onCheckedChange={(value: boolean) =>
              mainActions["add"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("edit")}
            className="ml-1"
            checked={permission.edit}
            onCheckedChange={(value: boolean) =>
              mainActions["edit"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("delete")}
            className="ml-1"
            checked={permission.delete}
            onCheckedChange={(value: boolean) =>
              mainActions["delete"](value, permission.permission)
            }
          />
          <CustomCheckbox
            text={t("view")}
            className="ml-1"
            checked={permission.view}
            onCheckedChange={(value: boolean) =>
              mainActions["view"](value, permission.permission)
            }
          />
        </div>
        {permission.sub.map((subPermission, index: number) => (
          <div
            key={index}
            className={`md:flex select-none md:flex-wrap xl:grid md:space-y-2 xl:space-y-0 space-y-3 xl:grid-cols-6 mt-2 items-center border-b pb-3 ${
              !permission.view && "pointer-events-none opacity-60"
            }`}
          >
            <div className="col-span-2 w-full justify-between xl:w-fit flex items-center gap-x-2">
              <h1 className="rtl:text-2xl-rtl ltr:text-xl-ltr text-start font-bold text-tertiary">
                {t(subPermission.name)}
              </h1>
              <CustomCheckbox
                parentClassName="space-x-1"
                checked={subPermission.singleRow}
                onCheckedChange={(value: boolean) =>
                  subActions["singleRow"](
                    value,
                    permission.permission,
                    subPermission.id
                  )
                }
                text={t("select_row")}
              />
            </div>
            <CustomCheckbox
              text={t("add")}
              className="ml-1"
              checked={subPermission.add}
              onCheckedChange={(value: boolean) =>
                subActions["add"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("edit")}
              className="ml-1"
              checked={subPermission.edit}
              onCheckedChange={(value: boolean) =>
                subActions["edit"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("delete")}
              className="ml-1"
              checked={subPermission.delete}
              onCheckedChange={(value: boolean) =>
                subActions["delete"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
            <CustomCheckbox
              text={t("view")}
              className="ml-1"
              checked={subPermission.view}
              onCheckedChange={(value: boolean) =>
                subActions["view"](
                  value,
                  permission.permission,
                  subPermission.id
                )
              }
            />
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default memo(PermissionSub);
