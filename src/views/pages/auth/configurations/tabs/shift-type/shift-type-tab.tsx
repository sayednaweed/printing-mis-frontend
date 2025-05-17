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
import { toLocaleDate } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import { Search } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import { SimpleItem, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import ShiftTypeDialog from "./shift-type-dialog";

interface ShiftTypeTabProps {
  permissions: UserPermission;
}
export default function ShiftTypeTab(props: ShiftTypeTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    shiftType: any;
  }>({
    visible: false,
    shiftType: undefined,
  });
  const [shiftTypes, setShiftTypes] = useState<{
    unFilterList: SimpleItem[];
    filterList: SimpleItem[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`shift-types`);
      const fetch = response.data as SimpleItem[];
      setShiftTypes({
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
    const filtered = shiftTypes.unFilterList.filter((item: SimpleItem) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setShiftTypes({
      ...shiftTypes,
      filterList: filtered,
    });
  };
  const add = (newItem: SimpleItem) => {
    setShiftTypes((prev) => ({
      unFilterList: [newItem, ...prev.unFilterList],
      filterList: [newItem, ...prev.filterList],
    }));
  };
  const update = (newItem: SimpleItem) => {
    setShiftTypes((prevState) => {
      const updatedUnFiltered = prevState.unFilterList.map((item) =>
        item.id === newItem.id ? { ...item, name: newItem.name } : item
      );

      return {
        ...prevState,
        unFilterList: updatedUnFiltered,
        filterList: updatedUnFiltered,
      };
    });
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
            shiftType: undefined,
          });
          return true;
        }}
      >
        <ShiftTypeDialog shiftType={selected.shiftType} onComplete={update} />
      </NastranModel>
    ),
    [selected.visible]
  );
  const shiftType = permissions.sub.get(
    PermissionEnum.configurations.sub.hr_configuration_shifts
  );
  const hasEdit = shiftType?.edit;
  const hasAdd = shiftType?.add;
  const hasView = shiftType?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_shift_type")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <ShiftTypeDialog onComplete={add} />
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
            <TableHead className="text-start">{t("date")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {loading ? (
            <TableRow>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            shiftTypes.filterList.map(
              (shiftType: SimpleItem, index: number) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={hasEdit}
                  onEdit={async (item: SimpleItem) => {
                    setSelected({
                      visible: true,
                      shiftType: item,
                    });
                  }}
                  key={index}
                  item={shiftType}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">{shiftType.id}</TableCell>
                  <TableCell>{shiftType.name}</TableCell>
                  <TableCell>
                    {toLocaleDate(new Date(shiftType.created_at), state)}
                  </TableCell>
                </TableRowIcon>
              )
            )
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
