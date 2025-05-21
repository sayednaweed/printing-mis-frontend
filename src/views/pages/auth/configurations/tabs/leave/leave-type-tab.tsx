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
import { LeaveItem, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import LeaveTypeDialog from "./leave-type-dialog";
import { toLocaleDate } from "@/lib/utils";
interface LeaveTypeTabProps {
  permissions: UserPermission;
}
export default function LeaveTypeTab(props: LeaveTypeTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    leaveType: any;
  }>({
    visible: false,
    leaveType: undefined,
  });
  const [leaveTypes, setLeaveTypes] = useState<{
    unFilterList: LeaveItem[];
    filterList: LeaveItem[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`/leave-types`);
      const fetch = response.data as LeaveItem[];
      setLeaveTypes({
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
    const filtered = leaveTypes.unFilterList.filter((item: LeaveItem) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setLeaveTypes({
      ...leaveTypes,
      filterList: filtered,
    });
  };
  const add = (newItem: LeaveItem) => {
    setLeaveTypes((prev) => ({
      unFilterList: [newItem, ...prev.unFilterList],
      filterList: [newItem, ...prev.filterList],
    }));
  };
  const update = (newItem: LeaveItem) => {
    setLeaveTypes((prevState) => {
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
            leaveType: undefined,
          });
          return true;
        }}
      >
        <LeaveTypeDialog leave={selected.leaveType} onComplete={update} />
      </NastranModel>
    ),
    [selected.visible]
  );
  const leave = permissions.sub.get(
    PermissionEnum.configurations.sub.hr_configuration_leave
  );
  const hasEdit = leave?.edit;
  const hasAdd = leave?.add;
  const hasView = leave?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_leave")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <LeaveTypeDialog onComplete={add} />
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
            <TableHead className="text-start">{t("leave")}</TableHead>
            <TableHead className="text-start">{t("start_date")}</TableHead>
            <TableHead className="text-start">{t("end_date")}</TableHead>
            <TableHead className="text-start">{t("reason")}</TableHead>
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
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
              <TableCell>
                <Shimmer className="h-[24px] bg-primary/30 w-full rounded-sm" />
              </TableCell>
            </TableRow>
          ) : (
            leaveTypes.filterList.map((leave: LeaveItem, index: number) => (
              <TableRowIcon
                read={hasView}
                remove={false}
                edit={hasEdit}
                onEdit={async (item: LeaveItem) => {
                  setSelected({
                    visible: true,
                    leaveType: item,
                  });
                }}
                key={index}
                item={leave}
                onRemove={async () => {}}
                onRead={async () => {}}
              >
                <TableCell className="font-medium">{leave.id}</TableCell>
                <TableCell>{leave.name}</TableCell>
                <TableCell className="font-medium">
                  {toLocaleDate(new Date(leave.start_date), state)}
                </TableCell>
                <TableCell className="font-medium">
                  {toLocaleDate(new Date(leave.end_date), state)}
                </TableCell>
                <TableCell className="font-medium">{leave.reason}</TableCell>
              </TableRowIcon>
            ))
          )}
        </TableBody>
      </Table>
      {dailog}
    </div>
  );
}
