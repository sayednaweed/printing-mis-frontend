import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { RefreshCcw } from "lucide-react";
import { useParams } from "react-router";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ButtonSpinner from "@/components/custom-ui/spinner/ButtonSpinner";
import { EmployeeStatus, UserPermission } from "@/database/tables";
import { useGlobalState } from "@/context/GlobalStateContext";
import { PermissionEnum } from "@/lib/constants";
interface EditSellerTransactionProps {
  permissions: UserPermission;
}
export default function EditSellerTransaction(
  props: EditSellerTransactionProps
) {
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
          <></>
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
