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
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import { useParams } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { EmployeeStatus, UserPermission } from "@/database/tables";
import { toLocaleDate } from "@/lib/utils";
import { useGlobalState } from "@/context/GlobalStateContext";
import { PermissionEnum, StatusEnum } from "@/lib/constants";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import EmployeeStatusDialog from "./dialog/employee-status-dialog";
interface EditEmployeeStatusProps {
  permissions: UserPermission;
}
export default function EditEmployeeStatus(props: EditEmployeeStatusProps) {
  const { permissions } = props;
  const { t } = useTranslation();
  const { id } = useParams();
  const [state] = useGlobalState();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [employeeStatuses, setEmployeeStatuses] = useState<EmployeeStatus[]>(
    []
  );
  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);
      // 2. Send data
      const response = await axiosClient.get(`employee/statuses/${id}`);
      if (response.status === 200) {
        const fetch = response.data as EmployeeStatus[];
        setEmployeeStatuses(fetch);
        if (failed) setFailed(false);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);

  const add = (employeeStatus: EmployeeStatus) => {
    setEmployeeStatuses((prev) => {
      // Set is_active to 0 for all others
      const updated = prev.map((item) => ({
        ...item,
        active: 0,
      }));
      return [employeeStatus, ...updated];
    });
  };

  const hasEdit = permissions.sub.get(
    PermissionEnum.employees.sub.employee_status
  )?.edit;
  return (
    <Card>
      <CardContent className="grid gap-x-4 gap-y-6 w-full mt-6">
        {failed ? (
          <h1 className="rtl:text-2xl-rtl">{t("u_are_not_authzed!")}</h1>
        ) : (
          <>
            {hasEdit && (
              <NastranModel
                size="lg"
                isDismissable={false}
                className="py-8"
                button={
                  <PrimaryButton className="text-primary-foreground">
                    {t("change_status")}
                  </PrimaryButton>
                }
                showDialog={async () => true}
              >
                <EmployeeStatusDialog onComplete={add} />
              </NastranModel>
            )}

            <Table className="w-full border">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-start">{t("#")}</TableHead>
                  <TableHead className="text-start">{t("status")}</TableHead>
                  <TableHead className="text-start">{t("saved_by")}</TableHead>
                  <TableHead className="text-start">{t("action")}</TableHead>
                  <TableHead className="text-start">{t("detail")}</TableHead>
                  <TableHead className="text-start">{t("date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rtl:text-xl-rtl ltr:text-lg-ltr">
                {loading ? (
                  <>
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
                      <TableCell>
                        <Shimmer className="h-[24px] w-full rounded-sm" />
                      </TableCell>
                      <TableCell>
                        <Shimmer className="h-[24px] w-full rounded-sm" />
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  employeeStatuses.map(
                    (employeeStatus: EmployeeStatus, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <BooleanStatusButton
                            getColor={function (): {
                              style: string;
                              value: string;
                            } {
                              return StatusEnum.active ==
                                employeeStatus.status_id
                                ? {
                                    style: "border-green-500/90",
                                    value: employeeStatus.status_name,
                                  }
                                : {
                                    style: "border-red-500",
                                    value: employeeStatus.status_name,
                                  };
                            }}
                          />
                        </TableCell>
                        <TableCell className="truncate max-w-44">
                          {employeeStatus.saved_by}
                        </TableCell>
                        <TableCell>
                          <BooleanStatusButton
                            getColor={function (): {
                              style: string;
                              value: string;
                            } {
                              return employeeStatus.active == 1
                                ? {
                                    style: "border-green-500/90",
                                    value: t("currently"),
                                  }
                                : {
                                    style: "border-blue-500/90",
                                    value: t("formerly"),
                                  };
                            }}
                          />
                        </TableCell>

                        <TableCell className="truncate max-w-44">
                          {employeeStatus.description}
                        </TableCell>
                        <TableCell className="truncate">
                          {toLocaleDate(
                            new Date(employeeStatus.created_at),
                            state
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>

      {failed && (
        <CardFooter>
          <PrimaryButton
            disabled={loading}
            onClick={async () => await initialize()}
            className={`${
              loading && "opacity-90"
            } bg-red-500 hover:bg-red-500/70`}
            type="submit"
          >
            <ButtonSpinner loading={loading}>
              {t("failed_retry")}
              <RefreshCcw className="ltr:ml-2 rtl:mr-2" />
            </ButtonSpinner>
          </PrimaryButton>
        </CardFooter>
      )}
    </Card>
  );
}
