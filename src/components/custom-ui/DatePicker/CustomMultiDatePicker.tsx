import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import DateObject from "react-date-object";
import { useTranslation } from "react-i18next";
import {
  afgMonthNamesEn,
  afgMonthNamesFa,
  CALENDAR,
  CALENDAR_LOCALE,
} from "@/lib/constants";
import { useGlobalState } from "@/context/GlobalStateContext";
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import DatePanel from "react-multi-date-picker/plugins/date_panel";

export interface CustomMultiDatePickerProps {
  dateOnComplete: (selectedDates: DateObject[]) => void;
  value: DateObject[];
  className?: string;
  placeholder?: string;
  lable?: string;
  requiredHint?: string;
  required?: boolean;
  hintColor?: string;
  errorMessage?: string;
  readonly?: boolean;
}

export default function CustomMultiDatePicker(
  props: CustomMultiDatePickerProps
) {
  const {
    dateOnComplete,
    value,
    className,
    placeholder,
    lable,
    requiredHint,
    required,
    hintColor,
    errorMessage,
    readonly,
  } = props;
  const [state] = useGlobalState();
  const { t, i18n } = useTranslation();
  const direction = i18n.dir();
  const [visible, setVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState<DateObject[]>(value);
  const calendarRef = useRef<any>(null);

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      calendarRef.current &&
      !calendarRef.current.contains(event.target as Node)
    ) {
      setVisible(false);
    }
  };

  const handleDateChange = (selectedDates: DateObject[]) => {
    // let object = { date, format };
    // const gre = new DateObject(object)
    // .convert(gregorian, gregorian_en)
    // .format();
    dateOnComplete(selectedDates);
    setSelectedDates(selectedDates);
  };
  const onVisibilityChange = () => setVisible(!visible);

  let months: any = [];
  if (state.systemLanguage.info.calendarId === CALENDAR.SOLAR) {
    if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.farsi) {
      months = afgMonthNamesFa;
    } else if (state.systemLanguage.info.localeId === CALENDAR_LOCALE.english) {
      months = afgMonthNamesEn;
    }
  }
  return (
    <div dir={direction} className={`relative`}>
      {visible && (
        <Calendar
          value={selectedDates}
          ref={calendarRef}
          className="absolute top-10"
          onChange={handleDateChange}
          months={months}
          range
          plugins={[<DatePanel />]}
          calendar={state.systemLanguage.calendar}
          locale={state.systemLanguage.local}
        />
      )}
      {required && (
        <span
          className={cn(
            "text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] top-[8px] absolute font-semibold",
            hintColor
          )}
        >
          {requiredHint}
        </span>
      )}
      <div
        className={cn(
          `border px-3 py-1 rounded-md ${readonly && "cursor-not-allowed"} ${
            required || lable ? "mt-[26px]" : "mt-2"
          } ${errorMessage && "border-red-400"}`,
          className
        )}
        onClick={onVisibilityChange}
      >
        {lable && (
          <label
            htmlFor={lable}
            className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] top-[0px] absolute font-semibold"
          >
            {lable}
          </label>
        )}
        {selectedDates && selectedDates.length > 0 ? (
          <div className="flex items-center gap-x-2 text-ellipsis rtl:text-lg-rtl ltr:text-lg-ltr text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary rtl:ml-2 rtl:mr-2" />
            {selectedDates.map((date: DateObject, index: number) => (
              <div key={index} className="flex gap-x-2">
                {index % 2 == 1 && (
                  <h1 className="text-tertiary font-semibold">
                    {state.systemLanguage.info.localeId ===
                      CALENDAR_LOCALE.farsi ||
                    state.systemLanguage.info.localeId ===
                      CALENDAR_LOCALE.arabic
                      ? "به"
                      : "to"}
                  </h1>
                )}
                {selectedDates ? (
                  <h1>
                    {date
                      .convert(
                        state.systemLanguage.calendar,
                        state.systemLanguage.local
                      )
                      .format()}
                  </h1>
                ) : (
                  <h1 className="flex items-center gap-x-2 py-[2px] text-ellipsis rtl:text-lg-rtl ltr:text-lg-ltr font-semibold text-primary text-nowrap">
                    <CalendarDays className="size-[16px] inline-block text-tertiary" />
                    {placeholder}
                  </h1>
                )}
              </div>
            ))}
          </div>
        ) : (
          <h1 className="flex items-center gap-x-2 text-ellipsis rtl:text-lg-rtl ltr:text-lg-ltr text-primary/80 text-nowrap">
            <CalendarDays className="size-[16px] inline-block text-tertiary" />
            {t("select_a_date")}
          </h1>
        )}
      </div>
      {errorMessage && (
        <h1 className="rtl:text-sm-rtl ltr:text-sm-ltr capitalize text-start text-red-400">
          {errorMessage}
        </h1>
      )}
    </div>
  );
}
