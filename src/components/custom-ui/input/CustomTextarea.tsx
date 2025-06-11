import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import React from "react";
import Shimmer from "../shimmer/Shimmer";

export interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  requiredHint?: string;
  lable?: string;
  parantClassName?: string;
  errorMessage?: string;
  loading?: boolean;
}
const CustomTextarea = React.forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>((props, ref: any) => {
  const {
    className,
    requiredHint,
    errorMessage,
    required,
    lable,
    loading = false,
    parantClassName,
    ...rest
  } = props;
  const marginTop = required || lable ? "mt-[26px]" : "mt-2";

  return (
    <div className={cn(``, parantClassName)}>
      {loading ? (
        <Shimmer
          className={`h-[50px] w-full border shadow-none rounded-sm ${marginTop}`}
        />
      ) : (
        <>
          {" "}
          <div className={cn(`relative ${marginTop}`)}>
            {required && (
              <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
                {requiredHint}
              </span>
            )}
            {lable && (
              <span className="rtl:text-lg-rtl ltr:text-xl-ltr rtl:right-[4px] ltr:left-[4px] ltr:-top-[22px] rtl:-top-[24px] absolute font-semibold">
                {lable}
              </span>
            )}

            <Textarea
              ref={ref}
              className={cn(
                `focus-visible:ring-0 rtl:text-lg-rtl ltr:text-lg-ltr dark:!bg-black/30 ${
                  errorMessage && "border-red-400 border "
                } ${props.readOnly && "cursor-not-allowed"}`,
                className
              )}
              {...rest}
              id={lable}
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
});

export default CustomTextarea;
