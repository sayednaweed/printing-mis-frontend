import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useGlobalState } from "@/context/GlobalStateContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toLocaleDate } from "@/lib/utils";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { PositionAssignment } from "@/database/tables";
import NastranModel from "@/components/custom-ui/model/NastranModel";
import AssignPositionDailog from "./parts/assign-position-dailog";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
export interface EditEmployeePromotionDemotionProps {
  id: string | undefined;
}
export default function EditEmployeePromotionDemotion(
  props: EditEmployeePromotionDemotionProps
) {
  const { id } = props;
  const [state] = useGlobalState();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [positionAssignments, setPositionAssignments] = useState<
    PositionAssignment[]
  >([]);
  const [viewDialog, setViewDialog] = useState<boolean>(false);
  const initialize = async () => {
    try {
      // 2. Send data
      const response = await axiosClient.get("employee/assigments/" + id);
      if (response.status == 200) {
        setPositionAssignments(response.data);
      }
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
  useEffect(() => {
    initialize();
  }, []);
  const assignPositionDialog = viewDialog && (
    <NastranModel
      size="lg"
      visible={true}
      isDismissable={false}
      button={undefined}
      showDialog={async () => true}
    >
      <AssignPositionDailog
        onComplete={(item: PositionAssignment) => {
          setPositionAssignments([item, ...positionAssignments]);
        }}
        onClose={() => setViewDialog(false)}
      />
    </NastranModel>
  );
  return (
    <Card>
      <CardHeader className="space-y-0">
        <CardTitle className="rtl:text-3xl-rtl ltr:text-2xl-ltr">
          {t("account_information")}
        </CardTitle>
        <CardDescription className="rtl:text-xl-rtl ltr:text-lg-ltr">
          {t("update_user_acc_info")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <NastranSpinner />
        ) : (
          <>
            {assignPositionDialog}
            <PrimaryButton
              disabled={loading}
              onClick={() => setViewDialog(true)}
              className={`shadow-lg`}
            >
              {t("promote_or_demote")}
            </PrimaryButton>
            <Table className="bg-card rounded-md">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-start">{t("#")}</TableHead>
                  <TableHead className="text-start">{t("hire_type")}</TableHead>
                  <TableHead className="text-start">{t("salary")}</TableHead>
                  <TableHead className="text-start">{t("shift")}</TableHead>
                  <TableHead className="text-start">{t("position")}</TableHead>
                  <TableHead className="text-start">
                    {t("position_change_type")}
                  </TableHead>
                  <TableHead className="text-start">
                    {t("overtime_rate")}
                  </TableHead>
                  <TableHead className="text-start">{t("currency")}</TableHead>
                  <TableHead className="text-start">
                    {t("department")}
                  </TableHead>
                  <TableHead className="text-start">{t("hire_date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
                {positionAssignments.map(
                  (item: PositionAssignment, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-start truncate">
                        {item.id}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.hire_type}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.salary}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.shift}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.position}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.position_change_type}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.overtime_rate}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.currency}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {item.department}
                      </TableCell>
                      <TableCell className="text-start truncate">
                        {toLocaleDate(new Date(item.hire_date), state)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
