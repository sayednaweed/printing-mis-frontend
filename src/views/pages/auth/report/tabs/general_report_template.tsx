// ReportTemplate.tsx

import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { ReportData } from "./Attendance";
import HeaderCard from "@/components/custom-ui/card/HeaderCard";

export default function ReportTemplate() {
  const location = useLocation();
  const navigate = useNavigate();
  const printableRef = useRef<HTMLDivElement>(null);

  const reportData = location.state as ReportData | undefined;

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: "Employee Attendance Report",
  } as any);
  // If no data was passed, show message and back button
  if (!reportData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <p className="text-lg text-red-600 font-semibold">
          No report data available.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const { reportType, department, hrCode, status, startDate, endDate } =
    reportData;

  return (
    <div className="space-y-6 mt-6">
      {/* Printable content */}
      <div
        ref={printableRef}
        className="rounded-xl bg-white shadow-lg border border-gray-200 p-6 space-y-6 max-w-4xl mx-auto"
      >
        <h1 className="text-center text-3xl font-bold text-green-700 tracking-wide border-b pb-2">
          Employee Attendance Report
        </h1>

        <div className="space-y-2 text-lg">
          <p>
            <strong>Report Type:</strong>{" "}
            {reportType === "general" ? "General" : "Individual"}
          </p>
          {reportType === "general" && (
            <p>
              <strong>Department:</strong> {department || "N/A"}
            </p>
          )}
          {reportType === "individual" && (
            <p>
              <strong>HR Code:</strong> {hrCode || "N/A"}
            </p>
          )}
          <p>
            <strong>Status:</strong> {status || "N/A"}
          </p>
          <p>
            <strong>Start Date:</strong> {startDate || "N/A"}
          </p>
          <p>
            <strong>End Date:</strong> {endDate || "N/A"}
          </p>
        </div>
      </div>

      {/* Action buttons (do not include inside printableRef) */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          onClick={handlePrint}
          className="w-40 text-base font-semibold tracking-wide shadow bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          Print Report
        </Button>

        <Button
          onClick={() => navigate(-1)}
          className="w-40 text-base font-semibold tracking-wide shadow bg-gray-500 hover:bg-gray-600 text-white"
        >
          Back
        </Button>
      </div>
    </div>
  );
}
