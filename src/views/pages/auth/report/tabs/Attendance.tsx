// AttendanceReport.tsx
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";
import { useReactToPrint } from "react-to-print";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import { t } from "i18next";
import { useState, useRef } from "react";
import { ComboboxItem } from "@/components/custom-ui/combobox/APICombobox";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router";

export interface ReportData {
  reportType: "general" | "individual";
  department?: string;
  hrCode?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export default function AttendanceReport() {
  const [reportType, setReportType] = useState<"general" | "individual">(
    "general"
  );
  const [formData, setFormData] = useState<ReportData | null>(null);
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: "Employee Attendance Report",
  } as any);

  const [department, setDepartment] = useState("");
  const [hrCode, setHrCode] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showReport, setShowReport] = useState(false);

  const navigate = useNavigate();

  const goToReportTemplate = () => {
    navigate("/print_report"); // Navigate to another page
  };

  const generateReport = () => {
    setFormData({
      reportType,
      department,
      hrCode,
      status,
      startDate,
      endDate,
    });
    setShowReport(true); // show the report view
  };

  return (
    <div className="space-y-6 mt-6">
      {!showReport ? (
        // === FORM UI ===
        <div className="rounded-xl bg-white shadow-lg border border-gray-200 p-6 space-y-6  mx-auto">
          <h1 className="text-center text-3xl font-bold text-green-700 tracking-wide border-b pb-2">
            {t("Employee Report Generator")}
          </h1>

          <div className="flex flex-wrap justify-start gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <Checkbox
                checked={reportType === "general"}
                onCheckedChange={() => setReportType("general")}
              />
              {t("General")}
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <Checkbox
                checked={reportType === "individual"}
                onCheckedChange={() => setReportType("individual")}
              />
              {t("Individual")}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportType === "general" && (
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                required={true}
                requiredHint={`* ${t("required")}`}
                lable={t("Department")}
                selectedItem={department}
                placeHolder={t("Select A Department")}
                errorMessage={""}
                apiUrl={"departments"}
                mode="single"
                onSelect={(items: ComboboxItem | ComboboxItem[]) => {
                  const selectedItems = Array.isArray(items) ? items : [items];
                  const values = selectedItems.map((item) => item.value);
                  setDepartment(values[0] || "");
                }}
              />
            )}

            {reportType === "individual" && (
              <APICombobox
                placeholderText={t("search_item")}
                errorText={t("no_item")}
                required={true}
                requiredHint={`* ${t("required")}`}
                lable={t("hr_code")}
                selectedItem={hrCode}
                placeHolder={t("Select hr_code")}
                errorMessage={""}
                apiUrl={"hr_code"}
                mode="single"
                onSelect={(items: ComboboxItem | ComboboxItem[]) => {
                  const selectedItems = Array.isArray(items) ? items : [items];
                  const values = selectedItems.map((item) => item.value);
                  setHrCode(values[0] || "");
                }}
              />
            )}

            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              lable={t("Status")}
              selectedItem={status}
              placeHolder={t("Select Status")}
              errorMessage={""}
              apiUrl={"departments"}
              mode="single"
              onSelect={(items: ComboboxItem | ComboboxItem[]) => {
                const selectedItems = Array.isArray(items) ? items : [items];
                const values = selectedItems.map((item) => item.value);
                setStatus(values[0] || "");
              }}
            />

            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("Start Date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={startDate}
              dateOnComplete={(date: DateObject) =>
                setStartDate(date.format("YYYY-MM-DD"))
              }
              className="py-3 w-full"
              errorMessage={""}
            />

            <CustomDatePicker
              placeholder={t("select_a_date")}
              lable={t("End Date")}
              requiredHint={`* ${t("required")}`}
              required={true}
              value={endDate}
              dateOnComplete={(date: DateObject) =>
                setEndDate(date.format("YYYY-MM-DD"))
              }
              className="py-3 w-full"
              errorMessage={""}
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button
              onClick={generateReport}
              className="w-40 text-base font-semibold tracking-wide shadow text-white"
            >
              {t("Generate Report")}
            </Button>
          </div>
        </div>
      ) : (
        // === REPORT UI ===
        <div
          ref={printableRef}
          className="bg-white mx-auto shadow p-6 border border-gray-300"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "20mm",
            boxSizing: "border-box",
          }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            {t("Employee Attendance Report")}
          </h2>

          <div className="flex items-start justify-between border-b py-2 text-[15px]">
            <span className="font-semibold text-gray-700">
              {t("Report Type")}:
            </span>
            <span className="text-gray-800">{formData?.reportType}</span>
          </div>
          {formData?.department && (
            <p>
              <strong>{t("Department")}:</strong> {formData.department}
            </p>
          )}
          {formData?.hrCode && (
            <p>
              <strong>{t("HR Code")}:</strong> {formData.hrCode}
            </p>
          )}
          <p>
            <strong>{t("Status")}:</strong> {formData?.status}
          </p>
          <p>
            <strong>{t("Start Date")}:</strong> {formData?.startDate}
          </p>
          <p>
            <strong>{t("End Date")}:</strong> {formData?.endDate}
          </p>
          <p>
            <strong>{t("Total Number of Employees")}:</strong>{" "}
            {formData?.endDate}
          </p>
          <p>
            <strong>{t("Number of Absents")}:</strong> {formData?.endDate}
          </p>
          <p>
            <strong>{t("Number of Presents")}:</strong> {formData?.endDate}
          </p>
          <p>
            <strong>{t("Number of People on Leave")}:</strong>{" "}
            {formData?.endDate}
          </p>
          <p>
            <strong>{t("Reporter Name")}:</strong> {formData?.endDate}
          </p>

          <div className="mt-5"></div>

          {/* Add more detailed report content here as needed */}

          <div className="flex justify-center gap-4 mt-8">
            <Button
              onClick={() => setShowReport(false)}
              className="w-40 text-base font-semibold tracking-wide shadow text-white bg-gray-500 hover:bg-gray-600"
            >
              {t("Back")}
            </Button>

            <Button
              onClick={handlePrint}
              className="w-40 text-base font-semibold tracking-wide shadow bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {t("Print Report")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
