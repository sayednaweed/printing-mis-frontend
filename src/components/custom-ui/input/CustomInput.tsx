import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import Shimmer from "../shimmer/Shimmer";
export type NastranInputSize = "sm" | "md" | "lg" | undefined;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?: any;
  startContentDark?: boolean;
  requiredHint?: string;
  lable?: string;
  loading?: boolean;
  endContent?: any;
  errorMessage?: string;
  parentClassName?: string;
  size_: NastranInputSize;
}
const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref: any) => {
    const {
      className,
      loading = false,
      type,
      requiredHint,
      startContent,
      startContentDark,
      endContent,
      parentClassName,
      size_,
      errorMessage,
      required,
      lable,
      ...rest
    } = props;
    const error = errorMessage != undefined;
    const marginTop = required || lable ? "mt-[26px]" : "mt-2";
    return (
      <div className={cn(" w-full", parentClassName)}>
        {loading ? (
          <Shimmer
            className={`h-[50px] w-full border shadow-none rounded-sm ${marginTop}`}
          />
        ) : (
          <>
            <div
              className={cn(
                `rtl:text-lg-rtl ltr:text-lg-ltr relative select-none h-fit ${marginTop}`,
                parentClassName
              )}
            >
              {startContent && (
                <span
                  className={`absolute flex items-center ${
                    startContentDark
                      ? "h-full bg-primary w-[40px] pt-[2px] rtl:rounded-tr-md rtl:rounded-br-md ltr:rounded-tl-md ltr:rounded-bl-md"
                      : "top-[16px] ltr:left-[12px] rtl:right-[12px]"
                  }`}
                >
                  {startContent}
                </span>
              )}
              {endContent && (
                <span
                  className={`absolute flex items-center ltr:right-[5px] rtl:left-[5px] top-[16px]`}
                >
                  {endContent}
                </span>
              )}
              {required && (
                <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
                  {requiredHint}
                </span>
              )}
              {lable && (
                <label
                  htmlFor={lable}
                  className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[26px] rtl:-top-[29px] absolute font-semibold"
                >
                  {lable}
                </label>
              )}

              <Input
                ref={ref}
                style={{
                  height: "50px",
                }}
                className={cn(
                  `focus-visible:ring-0 bg-card dark:bg-black/30 focus-visible:border-primary/30 focus-visible:ring-offset-0 ${
                    startContent
                      ? "rtl:pr-[42px] ltr:ps-[42px]"
                      : "rtl:pr-[12px] ltr:ps-[12px]"
                  } ${className} ${error && "border-red-400 border"} ${
                    props.readOnly && "cursor-not-allowed"
                  }`,
                  className
                )}
                type={type}
                {...rest}
              />
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
);

export default CustomInput;
