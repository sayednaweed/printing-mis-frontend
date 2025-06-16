import NastranModel from "@/components/custom-ui/model/NastranModel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalStateContext";
import axiosClient from "@/lib/axois-client";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { Icon, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import { toLocaleDate } from "@/lib/utils";
import IconDialog from "./icon-dialog";
import NetworkSvg from "@/components/custom-ui/image/NetworkSvg";
interface IconTabProps {
  permissions: UserPermission;
}
export default function IconTab(props: IconTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    icon: any;
  }>({
    visible: false,
    icon: undefined,
  });
  const [icons, setIcons] = useState<{
    unFilterList: Icon[];
    filterList: Icon[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`icons`);
      const fetch = response.data as Icon[];
      setIcons({
        unFilterList: fetch,
        filterList: fetch,
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const searchOnChange = (e: any) => {
    const { value } = e.target;
    // 1. Filter
    const filtered = icons.unFilterList.filter((item: Icon) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setIcons({
      ...icons,
      filterList: filtered,
    });
  };
  const onComplete = (icon: Icon, edited: boolean) => {
    if (edited) {
      setIcons((prevState) => {
        const updatedUnFiltered = prevState.unFilterList.map((item) =>
          item.id === icon.id
            ? {
                ...item,
                name: icon.name,
                path: icon.path,
              }
            : item
        );

        return {
          ...prevState,
          unFilterList: updatedUnFiltered,
          filterList: updatedUnFiltered,
        };
      });
    } else {
      setIcons((prev) => ({
        unFilterList: [icon, ...prev.unFilterList],
        filterList: [icon, ...prev.filterList],
      }));
    }
  };
  const dailog = useMemo(
    () => (
      <NastranModel
        size="lg"
        visible={selected.visible}
        isDismissable={false}
        button={<button></button>}
        showDialog={async () => {
          setSelected({
            visible: false,
            icon: undefined,
          });
          return true;
        }}
      >
        <IconDialog icon={selected.icon} onComplete={onComplete} />
      </NastranModel>
    ),
    [selected.visible]
  );
  const per = permissions.sub.get(
    PermissionEnum.configurations.sub.expense_configuration_expense_icon
  );
  const hasEdit = per?.edit;
  const hasAdd = per?.add;
  const hasView = per?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_icon")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <IconDialog onComplete={onComplete} />
          </NastranModel>
        )}

        <CustomInput
          size_="lg"
          placeholder={`${t("search")}...`}
          parentClassName="flex-1"
          type="text"
          onChange={searchOnChange}
          startContent={
            <Search className="size-[18px] mx-auto rtl:mr-[4px] text-primary pointer-events-none" />
          }
        />
      </div>
      <Table className="bg-card rounded-md mt-1 py-8 w-full">
        <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-start">{t("id")}</TableHead>
            <TableHead className="text-start">{t("name")}</TableHead>
            <TableHead className="text-start">{t("picture")}</TableHead>
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
            <TableRow>
              <TableCell>
                <Shimmer className="h-[24px] w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            icons.filterList.map((icon: Icon) => (
              <TableRowIcon
                read={hasView}
                remove={false}
                edit={hasEdit}
                onEdit={async (item: Icon) => {
                  setSelected({
                    visible: true,
                    icon: item,
                  });
                }}
                key={icon.id}
                item={icon}
                onRemove={async () => {}}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{icon.id}</TableCell>
                <TableCell>{icon.name}</TableCell>
                <TableCell>
                  <NetworkSvg
                    className="[&>svg]:size-[18px]"
                    src={icon?.path}
                    routeIdentifier={"public"}
                  />
                </TableCell>
                <TableCell>
                  {toLocaleDate(new Date(icon.created_at), state)}
                </TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
