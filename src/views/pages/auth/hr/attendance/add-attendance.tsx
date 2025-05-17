import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { useEffect, useState } from "react";
import { AttendanceStatus, TakeAttendance } from "@/database/tables";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";

export default function AddAttendance() {
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const closeModel = () => {
    modelOnRequestHide();
  };
  const [loading, setLoading] = useState(false);

  const [attendances, setAttendances] = useState<TakeAttendance[]>([]);
  const [statuses, setStatuses] = useState<AttendanceStatus[]>();

  const initialize = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.get("employee/attendance");
      if (response.status === 200) {
        const attendances = response.data.attendances;
        const statuses = response.data.statuses;
        setAttendances(attendances);
        setStatuses(statuses);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    initialize();
  }, []);
  const store = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await axiosClient.post("employee/assigment/change", {});
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        closeModel();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const skeleton = (
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
  );
  return (
    <Card className="w-full my-16 self-center [backdrop-filter:blur(20px)] bg-card">
      {loading ? (
        <NastranSpinner className="mt-4" />
      ) : (
        <>
          <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
            <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
              {t("promote_or_demote")}
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <Table className="bg-card rounded-md my-[2px] py-8">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-center px-1 w-[60px]">
                    {t("profile")}
                  </TableHead>
                  <TableHead className="text-start px-1">
                    {t("hr_code")}
                  </TableHead>
                  <TableHead className="text-start">{t("name")}</TableHead>
                  <TableHead className="text-start">{t("action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
                {loading ? (
                  <>{skeleton}</>
                ) : (
                  attendances.map((item) => (
                    <TableRow>
                      <TableCell className="px-1 py-0">
                        <CachedImage
                          src={item?.picture}
                          alt="Avatar"
                          ShimmerIconClassName="size-[18px]"
                          shimmerClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                          className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                          routeIdentifier={"profile"}
                        />
                      </TableCell>
                      <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                        {item.hr_code}
                      </TableCell>
                      <TableCell className="rtl:text-md-rtl truncate px-1 py-0">
                        {`${item.employee_name}`}
                      </TableCell>
                      <TableCell>
                        {statuses?.map((item) => (
                          <CustomCheckbox
                            checked={selected?.selected}
                            onCheckedChange={(value: boolean) => {
                              item.selected = value;
                              setSelected(item);
                            }}
                            parentClassName="rounded-md py-[12px] gap-x-1 bg-card border px-[10px]"
                            text={item.name}
                            required={true}
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-evenly items-center mt-12">
            <PrimaryButton
              disabled={loading}
              onClick={store}
              className={`shadow-lg`}
            >
              {t("confirm")}
            </PrimaryButton>
            <PrimaryButton
              className="rounded-md min-w-[80px] shadow-md rtl:text-xl-rtl bg-red-500 hover:bg-red-500"
              onClick={closeModel}
            >
              {t("cancel")}
            </PrimaryButton>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
