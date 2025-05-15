import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import axiosClient from "@/lib/axois-client";
import { toast } from "@/components/ui/use-toast";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import { useReactToPrint } from "react-to-print";

import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import { AttendanceGroupReport } from "@/lib/types";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import { ReportSelectionEnum } from "@/lib/constants";
import CustomInput from "@/components/custom-ui/input/CustomInput";

export default function ReportPage() {
  const componentRef = useRef<any>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef: componentRef,
    pageStyle: `
    @page {
      size: A4 landscape;
      margin: 0;
    }
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        margin: 0;
      }
    }
  `,
  });

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
const Report = forwardRef<HTMLDivElement, any>((_props, ref) => {
  const [fetching, setFetching] = useState(false);
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
    department: { id: number; name: string } | undefined;
  }>({
    fromDate: new DateObject(new Date()),
    toDate: new DateObject(new Date()),
    selection: undefined,
    attendance_status: undefined,
    employee_status: undefined,
    department: undefined,
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
  return (
    <div
      className="border h-[210mm] w-[297mm] text-black bg-white shadow-md"
      ref={ref}
      dir={direction}
      style={{ fontFamily: "Arial, sans-serif" }}
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

        <div className=" grid grid-cols-[auto_auto] items-center px-8 mt-4">
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

      <table className="w-full relative min-h-[300px] text-sm text-left rtl:text-right text-gray-500">
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
      </table>
    </div>
  );
});
