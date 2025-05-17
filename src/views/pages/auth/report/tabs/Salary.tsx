import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { DateObject } from "react-multi-date-picker";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { t } from "i18next";
import { useState } from "react";

export default function SalaryReport() {
  const [reportType, setReportType] = useState<"general" | "individual">(
    "general"
  );

  return (
    <div
      className="rounded-xl bg-card shadow-lg border border-border p-6 mt-6 max-w 
    space-y-6"
    >
      <h1
        className="text-center font-semibold text-foreground tracking-wide
      border-b border-gray-200 w-fit mx-auto text-3xl-rtl"
      >
        {t("Employee Report Generator")}
      </h1>

      <div className="flex flex-wrap justify-start gap-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
          <Checkbox
            checked={reportType === "general"}
            onCheckedChange={() => setReportType("general")}
          />
          {t("General")}
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
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
            selectedItem={""}
            placeHolder={t("Select A Department")}
            errorMessage={""}
            apiUrl={"departments"}
            mode="single"
            onSelect={() => void 0}
          />
        )}

        {reportType === "individual" && (
          <>
            <APICombobox
              placeholderText={t("search_item")}
              errorText={t("no_item")}
              required={true}
              requiredHint={`* ${t("required")}`}
              lable={t("hr_code")}
              selectedItem={""}
              placeHolder={t("Select hr_code")}
              errorMessage={""}
              apiUrl={"hr_code"}
              mode="single"
              onSelect={() => void 0}
            />
          </>
        )}

        <APICombobox
          placeholderText={t("search_item")}
          errorText={t("no_item")}
          required={true}
          requiredHint={`* ${t("required")}`}
          lable={t("Status")}
          selectedItem={""}
          placeHolder={t("Select Status")}
          errorMessage={""}
          apiUrl={"departments"}
          mode="single"
          onSelect={() => void 0}
        />

        <CustomDatePicker
          placeholder={t("select_a_date")}
          lable={t("Start Date")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={""}
          dateOnComplete={(date: DateObject) => {}}
          className="py-3 w-full"
          errorMessage={""}
        />

        <CustomDatePicker
          placeholder={t("select_a_date")}
          lable={t("End Date")}
          requiredHint={`* ${t("required")}`}
          required={true}
          value={""}
          dateOnComplete={(date: DateObject) => {}}
          className="py-3 w-full"
          errorMessage={""}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button className="w-40 text-base font-semibold tracking-wide shadow">
          {t("Generate Report")}
        </Button>
      </div>
    </div>
  );
}
