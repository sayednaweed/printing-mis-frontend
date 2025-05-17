import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import { useReactToPrint } from "react-to-print";

import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { AttendanceGroupReport } from "@/lib/types";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import {
  attendanceReportType,
  ReportSelectionEnum,
  ReportTypeSalary,
  ReportTypeSelectionEnum,
} from "@/lib/constants";
import CustomInput from "@/components/custom-ui/input/CustomInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ReportPage() {
  const componentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
  });

  // const handlePrint = useReactToPrint({
  //   content: () => componentRef?.current,
  // });

  return (
    <div className="flex flex-col items-center">
      <PrimaryButton className=" mt-4" onClick={reactToPrintFn}>
        Print Report
      </PrimaryButton>
      <div className="transform scale-90">
        <Report ref={componentRef} />
      </div>
    </div>
  );
}

type ReportType = "attendance" | "salary";

const Report = forwardRef<HTMLDivElement, any>((_props, ref) => {
  const [fetching, setFetching] = useState(false);
  const [reportType, setReportType] = useState<ReportType>("attendance");
  const [hover, setHover] = useState(false);
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();

  const [company, setCompany] = useState("");

  const [filters, setFilters] = useState<{
    fromDate: DateObject;
    toDate: DateObject;
    selection: { id: number; name: string } | undefined;
    attendance_status: { id: number; name: string } | undefined;
    employee_status: { id: number; name: string } | undefined;
    hr_code: { id: Number; hr_code: string } | undefined;
    department: { id: number; name: string } | undefined;
    report_type: { id: number; name: string } | undefined;
  }>({
    fromDate: new DateObject(new Date()),
    toDate: new DateObject(new Date()),
    selection: undefined,
    attendance_status: undefined,
    employee_status: undefined,
    department: undefined,
    hr_code: undefined,
    report_type: undefined,
  });
  const [reports, setReports] = useState<{
    items: {
      name: number;
      qty: string;
    }[];
    totalQty: string;
  }>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("image");
    const company = localStorage.getItem("company");
    if (company) {
      setImageSrc(savedImage);
      setCompany(company);
    }
  }, []);
  const initialize = async () => {
    try {
      const response = await axiosClient.post("report/reports", {
        filters: {
          from_date: filters.fromDate?.toDate()?.toISOString(),
          to_date: filters.toDate?.toDate()?.toISOString(),
        },
      });
      setReports({
        items: response.data.reports,
        totalQty: response.data.totalQty,
      });
    } catch (error: any) {
      console.log(error);
      toast({
        toastType: "ERROR",
        title: "Error!",
        description: error.response.data.message,
      });
    }
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem("image", base64String);
        setImageSrc(base64String);
      };
      reader.readAsDataURL(file);
      event.currentTarget.type = "text";
      event.currentTarget.type = "file";
    }
  };
  const handleUpload = () => {
    fileInput?.current?.click();
  };
  const removeLogo = (event: React.MouseEvent) => {
    event.stopPropagation();
    localStorage.removeItem("image");
    setImageSrc(null);
    setHover(!hover);
  };
  const companyOnchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCompany(value);
    localStorage.setItem("company", value);
  };

  const filtersAction: {
    [key in AttendanceGroupReport]: (value: DateObject, filter: string) => void;
  } = {
    setDate: async (value: any, filter: string) => {
      setFilters({ ...filters, [filter]: value });
    },
  };

  // const report_Type = useMemo(() => {
  //   return (
  //     // <>
  //     //   {filters.report_type?.id == ReportTypeSelectionEnum.attendance ? (
  //     //     filters.attendance_status?.id == attendanceReportType.general ? (
  //     //       <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
  //     //         <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
  //     //           <TableRow className="border-b dark:border-zinc-700">
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("date")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("name")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("position")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("Department")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("check_in")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("check_out")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("total_time")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("total_over_time")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("leave")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[80px] font-medium">
  //     //               {t("absent")}
  //     //             </TableHead>
  //     //           </TableRow>
  //     //         </TableHeader>

  //     //         <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
  //     //           {/* Example row for demonstration */}
  //     //           <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               5/14/2025
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Fardin
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Software Developer
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Information Technology
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">08:00</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">04:00</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">8h</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">0h</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //           </TableRow>
  //     //           <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
  //     //         </TableBody>
  //     //       </Table>
  //     //     ) : filters.attendance_status?.id ==
  //     //       attendanceReportType.individual ? (
  //     //       <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
  //     //         <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
  //     //           <TableRow className="border-b dark:border-zinc-700">
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("date")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("name")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("position")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //               {t("Department")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("check_in")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("check_out")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("total_time")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("total_over_time")}
  //     //             </TableHead>
  //     //             <TableHead className="text-left py-3 px-4 font-medium">
  //     //               {t("leave")}
  //     //             </TableHead>
  //     //             <TableHead className="text-center py-3 px-2 w-[80px] font-medium">
  //     //               {t("absent")}
  //     //             </TableHead>
  //     //           </TableRow>
  //     //         </TableHeader>

  //     //         <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
  //     //           {/* Example row for demonstration */}
  //     //           <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               5/14/2025
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Fardin
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Software Developer
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">
  //     //               Information Technology
  //     //             </TableCell>
  //     //             <TableCell className="text-center py-2 px-2">08:00</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">04:00</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">8h</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">0h</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //             <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //           </TableRow>
  //     //           <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
  //     //         </TableBody>
  //     //       </Table>
  //     //     ) : null
  //     //   ) : filters.report_type?.id == ReportTypeSelectionEnum.salary ? (
  //     //     filters.employee_status?.id == ReportSelectionEnum.all ? (
  //     //       <>
  //     //         {" "}
  //     //         <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
  //     //           <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
  //     //             <TableRow className="border-b dark:border-zinc-700">
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("hr_code")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("name")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("position")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("Department")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("date_range")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("salary_amount")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("over_time")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("total")}
  //     //               </TableHead>
  //     //             </TableRow>
  //     //           </TableHeader>

  //     //           <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
  //     //             {/* Example row for demonstration */}
  //     //             <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 5/14/2025
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Fardin
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Software Developer
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Information Technology
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 08:00
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 04:00
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">8h</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">0h</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //             </TableRow>
  //     //             <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
  //     //           </TableBody>
  //     //         </Table>
  //     //       </>
  //     //     ) : filters.employee_status?.id == ReportSelectionEnum.individual ? (
  //     //       <>
  //     //         <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
  //     //           <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
  //     //             <TableRow className="border-b dark:border-zinc-700">
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("Month")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("name")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("position")}
  //     //               </TableHead>
  //     //               <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
  //     //                 {t("Department")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("month")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("salary_amount")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("over_time")}
  //     //               </TableHead>
  //     //               <TableHead className="text-left py-3 px-4 font-medium">
  //     //                 {t("total")}
  //     //               </TableHead>
  //     //             </TableRow>
  //     //           </TableHeader>

  //     //           <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
  //     //             {/* Example row for demonstration */}
  //     //             <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 5/14/2025
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Fardin
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Software Developer
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 Information Technology
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 08:00
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">
  //     //                 04:00
  //     //               </TableCell>
  //     //               <TableCell className="text-center py-2 px-2">8h</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">0h</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //               <TableCell className="text-center py-2 px-2">No</TableCell>
  //     //             </TableRow>
  //     //             <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
  //     //           </TableBody>
  //     //         </Table>
  //     //       </>
  //     //     ) : null
  //     //   ) : null}
  //     // </>
  //   );
  // }, [
  //   filters.report_type?.id,
  //   filters.attendance_status?.id,
  //   filters.employee_status?.id,
  // ]);

  const deparment = useMemo(() => {
    if (filters.selection?.id == ReportSelectionEnum.all) {
      return (
        <>
          <h1 className="font-bold text-[16px]">{`${t("department")}:`}</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, department: selection })
            }
            selectedItem={filters["department"]?.name}
            placeHolder={t("select_a")}
            apiUrl={"departments"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1  w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);

  const attendance_individual = useMemo(() => {
    if (
      filters.selection?.id === attendanceReportType.individual &&
      filters.selection?.id === ReportTypeSelectionEnum.attendance
    ) {
      return (
        <>
          <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
            <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
              <TableRow className="border-b dark:border-zinc-700">
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("date")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("position")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("Department")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("check_in")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("check_out")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total_over_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("leave")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[80px] font-medium">
                  {t("absent")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
              {/* Example row for demonstration */}
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
                <TableCell className="text-center py-2 px-2">
                  5/14/2025
                </TableCell>
                <TableCell className="text-center py-2 px-2">Fardin</TableCell>
                <TableCell className="text-center py-2 px-2">
                  Software Developer
                </TableCell>
                <TableCell className="text-center py-2 px-2">
                  Information Technology
                </TableCell>
                <TableCell className="text-center py-2 px-2">08:00</TableCell>
                <TableCell className="text-center py-2 px-2">04:00</TableCell>
                <TableCell className="text-center py-2 px-2">8h</TableCell>
                <TableCell className="text-center py-2 px-2">0h</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
            </TableBody>
          </Table>
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);

  const attendance_general = useMemo(() => {
    if (
      filters.selection?.id === attendanceReportType.general &&
      filters.selection?.id === ReportTypeSelectionEnum.attendance
    ) {
      return (
        <>
          <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
            <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
              <TableRow className="border-b dark:border-zinc-700">
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("date")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("position")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("Department")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("check_in")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("check_out")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total_over_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("leave")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[80px] font-medium">
                  {t("absent")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
              {/* Example row for demonstration */}
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
                <TableCell className="text-center py-2 px-2">
                  5/14/2025
                </TableCell>
                <TableCell className="text-center py-2 px-2">Fardin</TableCell>
                <TableCell className="text-center py-2 px-2">
                  Software Developer
                </TableCell>
                <TableCell className="text-center py-2 px-2">
                  Information Technology
                </TableCell>
                <TableCell className="text-center py-2 px-2">08:00</TableCell>
                <TableCell className="text-center py-2 px-2">04:00</TableCell>
                <TableCell className="text-center py-2 px-2">8h</TableCell>
                <TableCell className="text-center py-2 px-2">0h</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
            </TableBody>
          </Table>
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);

  const salary_single_report = useMemo(() => {
    if (
      filters.selection?.id === ReportTypeSelectionEnum.salary &&
      filters.selection?.id === ReportTypeSalary.individual
    ) {
      return (
        <>
          <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
            <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
              <TableRow className="border-b dark:border-zinc-700">
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("Month")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("position")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("Department")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("month")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("salary_amount")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("over_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
              {/* Example row for demonstration */}
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
                <TableCell className="text-center py-2 px-2">
                  5/14/2025
                </TableCell>
                <TableCell className="text-center py-2 px-2">Fardin</TableCell>
                <TableCell className="text-center py-2 px-2">
                  Software Developer
                </TableCell>
                <TableCell className="text-center py-2 px-2">
                  Information Technology
                </TableCell>
                <TableCell className="text-center py-2 px-2">08:00</TableCell>
                <TableCell className="text-center py-2 px-2">04:00</TableCell>
                <TableCell className="text-center py-2 px-2">8h</TableCell>
                <TableCell className="text-center py-2 px-2">0h</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
            </TableBody>
          </Table>
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);

  const salary_general_report = useMemo(() => {
    if (
      filters.selection?.id === ReportTypeSalary.general &&
      filters.selection?.id === ReportTypeSalary.general
    ) {
      return (
        <>
          <Table className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 mt-5">
            <TableHeader className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 text-[15px] tracking-wide">
              <TableRow className="border-b dark:border-zinc-700">
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("hr_code")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("position")}
                </TableHead>
                <TableHead className="text-center py-3 px-2 w-[100px] font-medium">
                  {t("Department")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("date_range")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("salary_amount")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("over_time")}
                </TableHead>
                <TableHead className="text-left py-3 px-4 font-medium">
                  {t("total")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-gray-800 dark:text-gray-300 text-[14.5px]">
              {/* Example row for demonstration */}
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700">
                <TableCell className="text-center py-2 px-2">
                  5/14/2025
                </TableCell>
                <TableCell className="text-center py-2 px-2">Fardin</TableCell>
                <TableCell className="text-center py-2 px-2">
                  Software Developer
                </TableCell>
                <TableCell className="text-center py-2 px-2">
                  Information Technology
                </TableCell>
                <TableCell className="text-center py-2 px-2">08:00</TableCell>
                <TableCell className="text-center py-2 px-2">04:00</TableCell>
                <TableCell className="text-center py-2 px-2">8h</TableCell>
                <TableCell className="text-center py-2 px-2">0h</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
                <TableCell className="text-center py-2 px-2">No</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out border-b dark:border-zinc-700"></TableRow>
            </TableBody>
          </Table>
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);

  const hr_code = useMemo(() => {
    if (filters.selection?.id == ReportSelectionEnum.individual) {
      return (
        <>
          <h1 className="font-bold text-[16px]">{`${t("hr_code")}:`}</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, hr_code: selection })
            }
            selectedItem={filters["hr_code"]?.hr_code}
            placeHolder={t("select_a")}
            apiUrl={"hr_code"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1  w-fit hover:bg-black/5 transition-all 
            duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
        </>
      );
    }
    return undefined;
  }, [filters.selection?.id]);
  return (
    <div
      className="border h-[210mm] w-[297mm] aspect-[16/9] text-black bg-white shadow-md"
      ref={ref}
      dir={direction}
    >
      <section dir={direction}>
        <section className="flex gap-x-4 items-center px-8 pt-8">
          <div
            onMouseEnter={() => setHover(!hover)}
            onMouseLeave={() => setHover(!hover)}
            className={`overflow-hidden cursor-pointer flex items-center rounded-[2px] w-fit bg-primary/10 ${
              !imageSrc && "border-[2px] border-gray-600 border-dashed"
            }`}
          >
            <button
              type="button"
              className={`text-[13px] max-w-[100px] w-[100px] relative select-none text-gray-600 ${
                hover && !imageSrc && "h-[110px]"
              }`}
              onClick={handleUpload}
            >
              <input
                className="hidden"
                type="file"
                ref={fileInput}
                accept="image/*"
                onChange={handleFileChange}
              />
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Uploaded"
                  className="max-w-[100px] w-full h-[110px]"
                />
              ) : (
                "Your Logo"
              )}
              {hover && imageSrc && (
                <div className="absolute top-0 left-0 w-full h-full bg-slate-200">
                  <h1 className="flex items-center justify-center w-full h-full">
                    Change Image
                  </h1>
                  <X
                    onClick={removeLogo}
                    className="size-[22px] absolute top-0 right-0 rounded-full hover:bg-slate-400 transition bg-slate-300 border"
                  />
                </div>
              )}
            </button>
          </div>

          <CustomInput
            size_="sm"
            placeholder={t("company")}
            value={company}
            type="text"
            onChange={companyOnchange}
            className=" border-none text-[32px] shadow-none focus:bg-primary/5 text-wrap flex-1 rounded-sm"
          />
          <h1 className="text-[48px] text-tertiary font-semibold self-start">
            {t("reports")}
          </h1>
        </section>

        <div className=" grid grid-cols-[auto_auto] items-center px-8 mt-4 ">
          <h1 className="font-bold text-[16px]">{`${t("report_type")}:`}</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, report_type: selection })
            }
            selectedItem={filters["report_type"]?.name}
            placeHolder={t("select_a")}
            apiUrl={"hr/report/types"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1 w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
          <h1 className=" font-bold text-[16px] w-fit">{t("selection")}:</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, selection: selection })
            }
            selectedItem={filters["selection"]?.name}
            placeHolder={t("select_a")}
            apiUrl={"report/selections"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1  w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
          {hr_code}
          {deparment}
          <h1 className="font-bold text-[16px]">{`${t(
            "attendance_status"
          )}:`}</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, attendance_status: selection })
            }
            selectedItem={filters["attendance_status"]?.name}
            placeHolder={t("select_a")}
            apiUrl={"attendance/statuses"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1 pt-[5px]  w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
          <h1 className="font-bold text-[16px]">{`${t(
            "employee_status"
          )}:`}</h1>
          <APICombobox
            placeholderText={t("search_item")}
            errorText={t("no_item")}
            onSelect={(selection: any) =>
              setFilters({ ...filters, employee_status: selection })
            }
            selectedItem={filters["employee_status"]?.name}
            placeHolder={t("select_a")}
            apiUrl={"nid/types"}
            mode="single"
            className=" border-none hover:shadow-none m-0 p-1 w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
            cacheData={false}
            showIcon={false}
          />
        </div>
        <div className=" flex gap-x-3 items-center px-8 mt-8 mb-1">
          <h1 className="font-bold text-[16px] w-fit pt-2">
            {t("from_date")}:
          </h1>
          <CustomDatePicker
            placeholder={t("select_a_date")}
            value={filters.fromDate}
            dateOnComplete={(date: DateObject) =>
              filtersAction["setDate"](date, "fromDate")
            }
            className="border-none p-1  w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
          />
          <h1 className="font-bold text-[16px] pt-2 ltr:ml-9">
            {t("to_date")}:
          </h1>
          <CustomDatePicker
            placeholder={t("select_a_date")}
            value={filters.fromDate}
            dateOnComplete={(date: DateObject) =>
              filtersAction["setDate"](date, "fromDate")
            }
            className="border-none p-1  w-fit hover:bg-black/5 transition-all duration-300 ease-in-out"
          />
        </div>
      </section>

      {/* <table className="w-full relative min-h-[300px] text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Qty
            </th>
          </tr>
        </thead>
        <tbody>
          {fetching ? (
            <tr>
              <td colSpan={8}>
                <NastranSpinner />
              </td>
            </tr>
          ) : (
            reports &&
            reports.items.map((item, index: number) => (
              <tr key={index} className="bg-white">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  Active
                </th>
                <td className="px-8 py-4">{item.qty}</td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot className=" border-t">
          <tr className="font-semibold text-gray-900">
            <th scope="row" className="px-6 py-3 text-base">
              Total
            </th>
            <td className="px-8 py-3">{reports?.totalQty}</td>
          </tr>
        </tfoot>
      </table> */}
      {attendance_general}
      {attendance_individual}
      {salary_general_report}
      {salary_single_report}
    </div>
  );
});
