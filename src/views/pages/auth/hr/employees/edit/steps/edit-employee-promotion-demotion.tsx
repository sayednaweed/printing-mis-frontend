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
import { PositionAssignmentModel } from "@/database/tables";
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
    PositionAssignmentModel[]
  >([]);
  const initialize = async () => {
    try {
      // 2. Send data
      const response = await axiosClient.get("epi/person/issued/cards/" + id);
      if (response.status == 200) {
        setPositionAssignments(response.data.data);
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
      <CardContent>
        {loading ? (
          <NastranSpinner />
        ) : (
          <Table className="bg-card rounded-md">
            <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr bg-primary/5">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-start">{t("#")}</TableHead>
                <TableHead className="text-start">{t("visit_date")}</TableHead>
                <TableHead className="text-start">
                  {t("destina_country")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
              {positionAssignments.map(
                (item: PositionAssignmentModel, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="text-start truncate">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-start truncate">
                      {toLocaleDate(new Date(item.visited_date), state)}
                    </TableCell>
                    <TableCell className=" text-start truncate">
                      {item.destination_country}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
