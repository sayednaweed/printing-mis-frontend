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
import { HireTypeItem, UserPermission } from "@/database/tables";
import { PermissionEnum } from "@/lib/constants";
import HireTypeDialog from "./hire-type-dialog";
import { toLocaleDate } from "@/lib/utils";

interface HireTypeTabProps {
  permissions: UserPermission;
}
export default function HireTypeTab(props: HireTypeTabProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<{
    visible: boolean;
    hireType: any;
  }>({
    visible: false,
    hireType: undefined,
  });
  const [hireTypes, setHireTypes] = useState<{
    unFilterList: HireTypeItem[];
    filterList: HireTypeItem[];
  }>({
    unFilterList: [],
    filterList: [],
  });
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);

      // 2. Send data
      const response = await axiosClient.get(`hire-types`);
      const fetch = response.data as HireTypeItem[];
      setHireTypes({
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
    const filtered = hireTypes.unFilterList.filter((item: HireTypeItem) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setHireTypes({
      ...hireTypes,
      filterList: filtered,
    });
  };

  const onComplete = (hireTypeItem: HireTypeItem, edited: boolean) => {
    if (edited) {
      setHireTypes((prevState) => {
        const updatedUnFiltered = prevState.unFilterList.map((item) =>
          item.id === hireTypeItem.id
            ? { ...item, name: hireTypeItem.name, detail: hireTypeItem.detail }
            : item
        );

        return {
          ...prevState,
          unFilterList: updatedUnFiltered,
          filterList: updatedUnFiltered,
        };
      });
    } else {
      setHireTypes((prev) => ({
        unFilterList: [hireTypeItem, ...prev.unFilterList],
        filterList: [hireTypeItem, ...prev.filterList],
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
            hireType: undefined,
          });
          return true;
        }}
      >
        <HireTypeDialog hireType={selected.hireType} onComplete={onComplete} />
      </NastranModel>
    ),
    [selected.visible]
  );
  const hireType = permissions.sub.get(
    PermissionEnum.configurations.sub.hr_configuration_hire_type
  );
  const hasEdit = hireType?.edit;
  const hasAdd = hireType?.add;
  const hasView = hireType?.view;
  return (
    <div className="relative">
      <div className="rounded-md bg-card p-2 flex gap-x-4 items-baseline mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="text-primary-foreground">
                {t("add_hire_type")}
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <HireTypeDialog onComplete={onComplete} />
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
            <TableHead className="text-start">{t("detail")}</TableHead>
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
            </TableRow>
          ) : (
            hireTypes.filterList.map(
              (hireType: HireTypeItem, index: number) => (
                <TableRowIcon
                  read={hasView}
                  remove={false}
                  edit={hasEdit}
                  onEdit={async (item: HireTypeItem) => {
                    setSelected({
                      visible: true,
                      hireType: item,
                    });
                  }}
                  key={index}
                  item={hireType}
                  onRemove={async () => {}}
                  onRead={async () => {}}
                >
                  <TableCell className="font-medium">{hireType.id}</TableCell>
                  <TableCell>{hireType.name}</TableCell>
                  <TableCell>
                    {toLocaleDate(new Date(hireType.created_at), state)}
                  </TableCell>
                  <TableCell>{hireType.detail}</TableCell>
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
