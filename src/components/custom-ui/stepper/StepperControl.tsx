import { memo, useState } from "react";
import ButtonSpinner from "../spinner/ButtonSpinner";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

export interface IStepperControlProps {
  backText: string;
  nextText: string;
  confirmText: string;
  steps: {
    description: string;
    icon: any;
  }[];
  currentStep: number;
  isCardActive?: boolean;
  handleClick: (direction: string) => void;
  onSaveClose?: () => Promise<void>;
  onSaveCloseText?: string;
}
function StepperControl(props: IStepperControlProps) {
  const {
    steps,
    currentStep,
    handleClick,
    backText,
    nextText,
    confirmText,
    isCardActive,
    onSaveClose,
    onSaveCloseText,
  } = props;
  const [loading, setLoading] = useState(false);

  const onClose = async () => {
    if (onSaveClose) {
      setLoading(true);
      await onSaveClose();
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        isCardActive &&
        "mt-[3px] rounded-md bg-card py-4 border border-primary/10 dark:border-primary/20"
      } flex flex-wrap gap-x-1 gap-y-4 justify-around mb-4 text-[13px]`}
    >
      {/* Back Button */}
      <button
        onClick={() => {
          if (currentStep != 1) handleClick("back");
        }}
        className={`${
          currentStep == 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow shadow-md shadow-primary/50 hover:text-primary-foreground"
        } bg-primary flex gap-x-2 items-center rounded-md transition rtl:text-sm-rtl ltr:text-[14px] font-semibold w-fit text-primary-foreground/80 px-3 py-[6px] hover:bg-primary`}
      >
        <ChevronLeft className="size-[18px] inline rtl:rotate-180" />
        {backText}
      </button>
      {/* Next Button */}
      <button
        onClick={() => handleClick("next")}
        className="bg-green-500 flex gap-x-2 items-center hover:shadow transition rtl:text-sm-rtl ltr:text-[14px] font-semibold w-fit text-primary-foreground/80 shadow-md rounded-md shadow-primary/50 dark:shadow-green-400/50 px-3 py-[6px] hover:bg-green-500 hover:text-primary-foreground"
      >
        {currentStep == steps.length - 1 ? (
          <>
            {confirmText}
            <Check className="size-[18px] inline rtl:rotate-180" />
          </>
        ) : (
          <>
            {nextText}
            <ChevronRight className="size-[18px] inline rtl:rotate-180" />
          </>
        )}
      </button>
      {onSaveCloseText && (
        <button
          disabled={loading}
          onClick={onClose}
          className={`flex gap-x-2 items-center transition-all duration-500 rtl:text-sm-rtl ltr:text-[14px] font-semibold w-fit text-primary rounded-md hover:bg-primary hover:text-primary-foreground px-3 py-[6px] ${
            loading ? " bg-primary/30 border" : "border border-primary"
          }`}
        >
          <ButtonSpinner loading={loading}>{onSaveCloseText}</ButtonSpinner>
        </button>
      )}
    </div>
  );
}
export default memo(StepperControl);
