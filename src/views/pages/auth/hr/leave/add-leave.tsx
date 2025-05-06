// LeaveApplicationModal.tsx
import { X } from "lucide-react";
import CustomDatePicker from "@/components/custom-ui/DatePicker/CustomDatePicker";
import { StepperContext } from "@/components/custom-ui/stepper/StepperContext";
import { useScrollToElement } from "@/hook/use-scroll-to-element";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { DateObject } from "react-multi-date-picker";
import CustomTextarea from "@/components/custom-ui/input/CustomTextarea";
import APICombobox from "@/components/custom-ui/combobox/APICombobox";
import PrimaryButton from "@/components/custom-ui/button/PrimaryButton";


export default function LeaveApplicationModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { userData, setUserData, error } = useContext(StepperContext);
  useScrollToElement(error);


  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
      <div className="relative w-full h-[700px] bg-white p-6 rounded-md shadow-md 
      overflow-y-auto opacity-90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 p-2"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h3>Leave</h3>
        <hr className="w-full border-t border-gray-300 mt-4 mb-30" />
        <div className="mt-10 flex justify-center">
          <div className="flex flex-col gap-y-8 w-[450px]">
            
            
            <APICombobox
              onSelect={(selected: ComboboxItem) => {
                setUserData({ ...userData, employee_name: selected.name });
              }}
              selectedItem={userData.employee_name}
              apiUrl="/api/employees"
              placeHolder="Select Employee"
              mode="single"
              errorMessage={error.employee_name}
              errorText="No employee found"
              placeholderText="Type to search employee"
              lable="Employee"
              required
              requiredHint={`* ${t("required")}`}
            />

            <APICombobox
              onSelect={(selected: ComboboxItem) => {
                setUserData({ ...userData, employee_name: selected.name });
              }}
              selectedItem={userData.employee_name}
              apiUrl="/api/leave"
              placeHolder="Type"
              mode="single"
              errorMessage={error.employee_name}
              errorText="No Type Was Found"
              placeholderText="Type"
              lable="Leave Type"
              required
              requiredHint={`* ${t("required")}`}
            />

            <CustomDatePicker
              placeholder=""
              lable={t("Start Date")}
              required
              requiredHint={`* ${t("required")}`}
              value={userData.start_date}
              dateOnComplete={(date: DateObject) =>
                setUserData({ ...userData, start_date: date })
              }
              errorMessage={error.get("start_date")}
            />

            <CustomDatePicker
              placeholder=""
              lable={t("End Date")}
              required
              requiredHint={`* ${t("required")}`}
              value={userData.end_date}
              dateOnComplete={(date: DateObject) =>
                setUserData({ ...userData, end_date: date })
              }
              errorMessage={error.get("end_date")}
            />

            <CustomTextarea
              lable={t("Reason")}
              parentClassName="w-full"
              name="leave_reason"
              value={userData.leave_reason}
              onChange={(value: string) => {
                setUserData({ ...userData, leave_reason: value });
              }}
              placeholder={t("Explanation")}
              rows={4}
              error={error.leave_reason}
            />

              <div className = "">
              <PrimaryButton className="text-green-200">
              {t("Add")}
              </PrimaryButton>
              </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}
