import { useEffect, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";

import { cn, isString } from "@/lib/utils";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import Shimmer from "../shimmer/Shimmer";

export interface CustomTimePickerProps {
  dateOnComplete: (date: DateObject) => void;
  value: DateObject | undefined | string;
  className?: string;
  parentClassName?: string;
  placeholder: string;
  place?: string;
  required?: boolean;
  requiredHint?: string;
  hintColor?: string;
  lable: string;
  errorMessage?: string;
  readonly?: boolean;
  loading?: boolean;
}

export default function CustomTimePicker(props: CustomTimePickerProps) {
  const {
    dateOnComplete,
    value,
    className,
    parentClassName,
    placeholder,
    required,
    requiredHint,
    hintColor,
    errorMessage,
    lable,
    loading = false,
    readonly,
  } = props;
  const [selectedDates, setSelectedDates] = useState<DateObject | undefined>(
    isString(value) ? new DateObject(new Date(value)) : value
  );
  const calendarRef = useRef<any>(null);

  const handleDateChange = (date: DateObject) => {
    dateOnComplete(date);

    if (date instanceof DateObject) setSelectedDates(date);
  };

  useEffect(() => {
    if (value instanceof DateObject) setSelectedDates(value);
  }, [value]);
  const marginTop = required || lable ? "mt-[26px]" : "mt-2";

  return (
    <div className={cn("relative", parentClassName)}>
      {loading ? (
        <Shimmer
          className={`h-[50px] w-full border shadow-none rounded-sm ${marginTop}`}
        />
      ) : (
        <>
          <div
            className={cn(
              `border flex flex-col relative h-fit !p-0 rounded-md ${marginTop} ${
                readonly && "cursor-not-allowed"
              } ${errorMessage && "border-red-400"}`,
              className
            )}
          >
            {required && (
              <span
                className={cn(
                  "text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold",
                  hintColor
                )}
              >
                {requiredHint}
              </span>
            )}
            <DatePicker
              value={selectedDates}
              ref={calendarRef}
              onChange={handleDateChange}
              placeholder={placeholder}
              disableDayPicker
              style={{
                border: "none",
                borderRadius: "4px",
                padding: "13px 12px",
                fontSize: "14px",
                width: "100%",
                height: "100%",
              }}
              format="HH:mm A"
              plugins={[<TimePicker hideSeconds />]}
            />
            {lable && (
              <label
                htmlFor={lable}
                className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[26px] rtl:-top-[29px] absolute font-semibold"
              >
                {lable}
              </label>
            )}
          </div>
          {errorMessage && (
            <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
              {errorMessage}
            </h1>
          )}
        </>
      )}
    </div>
  );
}
