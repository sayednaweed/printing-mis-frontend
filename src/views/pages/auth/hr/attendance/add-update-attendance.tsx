import { useTranslation } from "react-i18next";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import { useEffect, useState } from "react";
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
import {
  Attendance,
  AttendanceModel,
  AttendanceStatus,
} from "@/database/tables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import Shimmer from "@/components/custom-ui/shimmer/Shimmer";
import CustomCheckbox from "@/components/custom-ui/checkbox/CustomCheckbox";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";

interface AddUpdateAttendanceProps {
  onComplete: (attendance: AttendanceModel) => void;
  attendance?: AttendanceModel;
  onCloseModel?: () => void;
}

export default function AddUpdateAttendance(props: AddUpdateAttendanceProps) {
  const { onComplete, attendance, onCloseModel } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [loading, setLoading] = useState(false);
  const closeModel = () => {
    if (onCloseModel) onCloseModel();
    modelOnRequestHide();
  };
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const fetch = async () => {
    try {
      setLoading(true);
      const url = attendance
        ? `attendancies/${attendance?.id}`
        : "attendancies-employees";
      const response = await axiosClient.get(url);
      if (response.status === 200) {
        setAttendances(response.data.data);
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("success"),
        description: error.response.data?.message,
      });
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetch();
  }, []);
  const store = async () => {
    if (loading || attendances.length == 0) {
      return;
    }

    setLoading(true);
    // 2. Store
    try {
      const list = attendances.map((item) => {
        let status_id = "0";
        item.status.forEach((status) => {
          if (status.selected == true) {
            status_id = status.id;
          }
        });
        return {
          hr_code: item.hr_code,
          description: item.detail,
          employee_id: item.id,
          status_type_id: status_id,
        };
      });
      const response = await axiosClient.post("attendancies", {
        attendances: list,
      });
      if (response.status == 200) {
        onComplete(response.data?.leave);
        // Update user state
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
        closeModel();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (
    attendance: Attendance,
    item: AttendanceStatus,
    value: boolean
  ) => {
    setAttendances((prev) => {
      return prev.map((att) => {
        if (att.hr_code == attendance.hr_code) {
          return {
            ...att,
            status: att.status.map((status) =>
              status.id == item.id && item.selected == false
                ? { ...item, selected: value }
                : value
                ? { ...status, selected: false }
                : status
            ),
          };
        } else {
          return att;
        }
      });
    });
  };
  const handleChange = (attendance: Attendance, e: any) => {
    const { value } = e.target;

    setAttendances((prev) => {
      return prev.map((att) => {
        if (att.hr_code == attendance.hr_code) {
          return {
            ...att,
            detail: value,
          };
        } else {
          return att;
        }
      });
    });
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
              {t("take_attendance")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center mt-4 gap-y-3">
            <Table className="bg-card rounded-md my-[2px] py-8">
              <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-center">{t("picture")}</TableHead>
                  <TableHead className="text-start">{t("hr_code")}</TableHead>
                  <TableHead className="text-start">{t("name")}</TableHead>
                  <TableHead className="text-start">{t("detail")}</TableHead>
                  {attendances.length == 1 &&
                    attendances[0].status?.map((item, index: number) => (
                      <TableHead key={index} className="text-start">
                        {item?.name}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody className="rtl:text-xl-rtl ltr:text-2xl-ltr">
                {loading ? (
                  <>{skeleton}</>
                ) : (
                  attendances.map((attendance) => (
                    <TableRow key={attendance.hr_code}>
                      <TableCell className="px-1 py-0">
                        <CachedImage
                          src={attendance?.hr_code}
                          alt="Avatar"
                          ShimmerIconClassName="size-[18px]"
                          shimmerClassName="size-[36px] mx-auto shadow-lg border border-tertiary rounded-full"
                          className="size-[36px] object-center object-cover mx-auto shadow-lg border border-tertiary rounded-full"
                          routeIdentifier={"profile"}
                        />
                      </TableCell>
                      <TableCell className="truncate text-start">
                        {attendance.hr_code}
                      </TableCell>
                      <TableCell className="truncate text-start">
                        {`${attendance.first_name} ${attendance.last_name}`}
                      </TableCell>
                      <TableCell className="truncate text-start">
                        <CustomTextarea
                          name="detail"
                          value={attendance.detail}
                          placeholder={t("detail")}
                          onChange={(e: any) => handleChange(attendance, e)}
                          rows={-1}
                          className="p-1 resize-none"
                        />
                      </TableCell>
                      {attendance.status?.map((item) => (
                        <TableCell className="truncate text-start">
                          <CustomCheckbox
                            key={item.id}
                            checked={item.selected}
                            onCheckedChange={(value: boolean) =>
                              handleCheck(attendance, item, value)
                            }
                            parentClassName="rounded-md"
                            required={true}
                          />
                        </TableCell>
                      ))}
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
