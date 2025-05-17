import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
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
import { User, UserPermission } from "@/database/tables";
import { PermissionEnum, PortalEnum } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import axiosClient from "@/lib/axois-client";
import { Plus } from 'lucide-react';

import TableRowIcon from "@/components/custom-ui/table/TableRowIcon";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { Search } from "lucide-react";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import AddLeave from "./add-leave";
import { DateObject } from "react-multi-date-picker";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { UserPaginationData } from "@/lib/types";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";

export function LeaveTable() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("sch_val");
  const searchColumn = searchParams.get("sch_col");
  const sort = searchParams.get("sort");
  const order = searchParams.get("order");
  const startDate = searchParams.get("st_dt");
  const endDate = searchParams.get("en_dt");

  const filters = {
    sort: sort || "created_at",
    order: order || "desc",
    search: {
      column: searchColumn || "username",
      value: searchValue || "",
    },
    date: startDate && endDate
      ? [new DateObject(new Date(startDate)), new DateObject(new Date(endDate))]
      : startDate
      ? [new DateObject(new Date(startDate))]
      : endDate
      ? [new DateObject(new Date(endDate))]
      : [],
  };

  const loadList = async (searchInput: string | undefined = undefined, count: number | undefined, page: number | undefined) => {
    try {
      if (loading) return;
      setLoading(true);
      const dates = {
        startDate: startDate,
        endDate: endDate,
      };
      const response = await axiosClient.get(
        user.role.name.startsWith("finance") ? "finance/users" : "epi/users",
        {
          params: {
            page,
            per_page: count,
            filters: {
              sort: filters.sort,
              order: filters.order,
              search: {
                column: filters.search.column,
                value: searchInput,
              },
              date: dates,
            },
          },
        }
      );
      const fetch = response.data.users.data as User[];
      const lastPage = response.data.users.last_page;
      const totalItems = response.data.users.total;
      const perPage = response.data.users.per_page;
      const currentPage = response.data.users.current_page;

      setUsers({
        filterList: {
          data: fetch,
          lastPage,
          totalItems,
          perPage,
          currentPage,
        },
        unFilterList: {
          data: fetch,
          lastPage,
          totalItems,
          perPage,
          currentPage,
        },
      });
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const initialize = async (searchInput: string | undefined = undefined, count: number | undefined = 10, page: number | undefined = 1) => {
    loadList(searchInput, count, page);
  };

  useEffect(() => {
    initialize(undefined, undefined, 1);
  }, [sort, startDate, endDate, order]);

  const [users, setUsers] = useState<{
    filterList: UserPaginationData;
    unFilterList: UserPaginationData;
  }>({
    filterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
    unFilterList: {
      data: [],
      lastPage: 1,
      totalItems: 0,
      perPage: 0,
      currentPage: 0,
    },
  });

  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [state] = useGlobalState();

  const addItem = (user: User) => {
    setUsers((prevState) => ({
      filterList: {
        ...prevState.filterList,
        data: [user, ...prevState.filterList.data],
      },
      unFilterList: {
        ...prevState.unFilterList,
        data: [user, ...prevState.unFilterList.data],
      },
    }));
  };

  const skeleton = (
    <TableRow>
      {[...Array(6)].map((_, i) => (
        <TableCell key={i}>
          <Shimmer className="h-6 w-full rounded-sm" />
        </TableCell>
      ))}
    </TableRow>
  );

  const per: UserPermission = user?.permissions[PortalEnum.hr].get(PermissionEnum.users.name) as UserPermission;
  const hasView = per?.view;
  const hasAdd = per?.add;

  const watchOnClick = async (user: User) => {
    const userId = user.id;
    navigate(`/users/${userId}`);
  };

  return (
    <div className="w-full ml-auto p-5">
      {/* Right-aligned container */}
      {/* Search/Add section */}
      <div className="flex flex-col sm:flex-row gap-2 bg-card rounded-md p-2 mt-4">
        {hasAdd && (
          <NastranModel
            size="lg"
            isDismissable={false}
            button={
              <PrimaryButton className="font-semibold h-12 mt-2 text-green-300">
                {t("Add Leave")}
                <Plus size={24} color="#81C784" strokeWidth={2} className="mr-2" />
              </PrimaryButton>
            }
            showDialog={async () => true}
          >
            <AddLeave onComplete={addItem} />
          </NastranModel>
        )}

        <div className="flex-1 flex gap-2">
          <CustomInput
            size_="lg"
            placeholder={`${t("search")}...`}
            className="flex-1 w-[500px]"
            ref={searchRef}
            startContent={<Search className="size-[18px] text-primary" />}
          />
        </div>
      </div>

      {/* Table */}
      <Table className="bg-card rounded-md my-2 w-1/2 m-5 bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">{t("photo")}</TableHead>
            <TableHead>{t("HR Code")}</TableHead>
            <TableHead>{t("Employee Name")}</TableHead>
            <TableHead>{t("Start Date")}</TableHead>
            <TableHead>{t("End Date")}</TableHead>
            <TableHead>{t("Reason")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? skeleton
            : users.filterList?.data?.map((user, i) => (
                <TableRow key={user.id} className="cursor-pointer">
                  <TableCell className="p-0">
                    <CachedImage
                      className="h-12 w-12 rounded-full"
                      url={user?.profile?.picture_url || ""}
                    />
                  </TableCell>
                  <TableCell>{user?.hr_code}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <TableRowIcon
                        className="h-8 w-8"
                        image={user.profile?.image_url}
                        alt={user.profile?.first_name}
                      />
                      <div>{user?.profile?.first_name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user?.leave?.start_date}</TableCell>
                  <TableCell>{user?.leave?.end_date}</TableCell>
                  <TableCell>{user?.leave?.reason}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
