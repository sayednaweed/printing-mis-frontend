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
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import BooleanStatusButton from "@/components/custom-ui/button/BooleanStatusButton";
import { AttendanceStatusEnum } from "@/lib/constants";

interface AddUpdateAttendanceProps {
  onComplete: (attendance: AttendanceModel) => void;
  attendance?: AttendanceModel;
  onCloseModel?: () => void;
}

export default function AddUpdateAttendance(props: AddUpdateAttendanceProps) {
  const { onComplete, attendance, onCloseModel } = props;
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();
  const [shift, setShift] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const closeModel = () => {
    if (onCloseModel) onCloseModel();
    modelOnRequestHide();
  };
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const fetch = async (shiftId: string) => {
    try {
      setLoading(true);
      const response = await axiosClient.get("attendancies-show", {
        params: {
          shift_id: shiftId,
          created_at: attendance?.created_at,
        },
      });
      if (response.status === 200) {
        setAttendances(response.data.data);
        if (attendance) {
          setShift(response.data?.shift);
        }
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data?.message,
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    if (attendance) {
      fetch(attendance.shift_id);
    }
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
        shift_id: shift?.id,
      });
      if (response.status == 200) {
        onComplete(response.data?.attendance);
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
      <CardHeader className="text-start sticky top-0 rounded-t-lg border-b bg-card pb-2 z-10">
        <CardTitle className="rtl:text-4xl-rtl mb-4 ltr:text-3xl-ltr text-tertiary">
          {t("take_attendance")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col mt-4 gap-y-6">
        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          required={true}
          requiredHint={`* ${t("required")}`}
          onSelect={(selection: any) => {
            setShift(selection);
            fetch(selection?.id);
          }}
          selectedItem={shift?.name}
          lable={t("work_shift")}
          placeHolder={t("select_a")}
          apiUrl={"shifts-names"}
          mode="single"
          parentClassName="w-fit"
          cacheData={false}
        />
        <Table className="bg-card rounded-md my-[2px] py-8">
          <TableHeader className="rtl:text-3xl-rtl ltr:text-xl-ltr">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center">{t("picture")}</TableHead>
              <TableHead className="text-start">{t("hr_code")}</TableHead>
              <TableHead className="text-start">{t("name")}</TableHead>
              <TableHead className="text-start">{t("detail")}</TableHead>
              <TableHead className="text-start">{t("check_in")}</TableHead>
              <TableHead className="text-start">{t("check_out")}</TableHead>
              <TableHead className="text-start">{t("check_in_time")}</TableHead>
              <TableHead className="text-start">
                {t("check_in_taken_by")}
              </TableHead>
              <TableHead className="text-start">
                {t("check_out_time")}
              </TableHead>
              <TableHead className="text-start">
                {t("check_out_taken_by")}
              </TableHead>
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
                      src={attendance?.picture}
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

                  <TableCell className="truncate text-start font-semibold">
                    {attendance.check_in_status ? (
                      <BooleanStatusButton
                        getColor={function (): {
                          style: string;
                          value: string;
                        } {
                          return AttendanceStatusEnum.present ==
                            attendance.check_in_status_id
                            ? {
                                style: "border-green-500/90",
                                value: attendance?.check_in_status,
                              }
                            : {
                                style: "border-red-500",
                                value: attendance?.check_in_status,
                              };
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-2 items-baseline gap-2">
                        {attendance.status?.map((item) => (
                          <CustomCheckbox
                            text={item.name}
                            key={item.id}
                            checked={item.selected}
                            onCheckedChange={(value: boolean) =>
                              handleCheck(attendance, item, value)
                            }
                            parentClassName="rounded-md space-x-1"
                            required={true}
                          />
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="truncate text-start font-semibold">
                    {!attendance.check_in_status ? undefined : attendance.check_out_status ? (
                      <BooleanStatusButton
                        getColor={function (): {
                          style: string;
                          value: string;
                        } {
                          return AttendanceStatusEnum.present ==
                            attendance.check_out_status_id
                            ? {
                                style: "border-green-500/90",
                                value: attendance?.check_out_status,
                              }
                            : {
                                style: "border-red-500",
                                value: attendance?.check_out_status,
                              };
                        }}
                      />
                    ) : (
                      <div className="grid grid-cols-2 items-baseline gap-2">
                        {attendance.status?.map((item) => (
                          <CustomCheckbox
                            text={item.name}
                            key={item.id}
                            checked={item.selected}
                            onCheckedChange={(value: boolean) =>
                              handleCheck(attendance, item, value)
                            }
                            parentClassName="rounded-md space-x-1"
                            required={true}
                          />
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="truncate text-start">
                    {attendance.check_in_time}
                  </TableCell>
                  <TableCell className="truncate text-start">
                    {attendance.check_in_taken_by}
                  </TableCell>
                  <TableCell className="truncate text-start">
                    {attendance?.check_out_time}
                  </TableCell>
                  <TableCell className="truncate text-start">
                    {attendance?.check_out_taken_by}
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
    </Card>
  );
}
