import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/ui/use-toast";
import CloseButton from "@/components/custom-ui/button/CloseButton";
import { useModelOnRequestHide } from "@/components/custom-ui/model/hook/useModelOnRequestHide";
import axiosClient from "@/lib/axois-client";
import {
  UserRound,
  Briefcase,
  Mail,
  Phone,
  Clock,
  StickyNote
} from "lucide-react";

export default function AddLeave({ onComplete }: { onComplete: (user: any) => void }) {
  const { t } = useTranslation();
  const { modelOnRequestHide } = useModelOnRequestHide();

  const [formData, setFormData] = useState({
    full_name: "",
    role: "",
    email: "",
    contact: "",
    duration: "",
    reason: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.full_name) newErrors.full_name = t("full_name_required");
    if (!formData.role) newErrors.role = t("role_required");
    if (!formData.email) newErrors.email = t("email_required");
    if (!formData.contact) newErrors.contact = t("contact_required");
    if (!formData.duration) newErrors.duration = t("duration_required");
    if (!formData.reason) newErrors.reason = t("reason_required");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await axiosClient.post("/leave/request", formData);
      if (response.status === 200) {
        toast({
          toastType: "SUCCESS",
          description: response.data.message,
        });
        onComplete(response.data.user);
        modelOnRequestHide();
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] overflow-y-auto bg-white rounded-xl shadow-2xl p-6 md:p-5">
      <div className="flex justify-end">
        <CloseButton dismissModel={modelOnRequestHide} />
      </div>

      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <StickyNote className="text-green-500" />
        {t("Add Leave")}
      </h2>

      <div className="grid grid-cols-1 gap-3">
        <InputField
          icon={<UserRound className="text-green-500" />}
          name="full_name"
          placeholder={t("full_name")}
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
        />
        <InputField
          icon={<Briefcase className="text-green-500" />}
          name="role"
          placeholder={t("role")}
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
        />
        <InputField
          icon={<Mail className="text-green-500" />}
          name="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <InputField
          icon={<Phone className="text-green-500" />}
          name="contact"
          placeholder={t("contact")}
          value={formData.contact}
          onChange={handleChange}
          error={errors.contact}
        />
        <InputField
          icon={<Clock className="text-green-500" />}
          name="duration"
          placeholder={t("Duration")}
          value={formData.duration}
          onChange={handleChange}
          error={errors.duration}
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <StickyNote className="text-green-500" />
            <label className="text-gray-600">{t("Reason For Leave")}</label>
          </div>
          <textarea
            name="reason"
            placeholder={t("Reason For Leave")}
            value={formData.reason}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-200 hover:bg-blue-300 text-blue-800 font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}

function InputField({
  icon,
  name,
  placeholder,
  value,
  onChange,
  error,
}: {
  icon: React.ReactNode;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <label className="text-gray-600">{placeholder}</label>
      </div>
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
