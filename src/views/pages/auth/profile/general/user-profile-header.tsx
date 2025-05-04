import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { validateFile } from "@/lib/utils";
import { useAuthStore } from "@/stores/permission/auth-permssion-store";

interface UserProfileHeaderProps {
  profile_upload_url: string;
  profile_delete_url: string;
}
export default function UserProfileHeader(props: UserProfileHeaderProps) {
  const { profile_delete_url, profile_upload_url } = props;
  const { user, setUser } = useAuthStore();

  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    if (!fileInput.files || fileInput.files.length === 0) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("ples_sel_vali_file"),
      });
      return;
    }
    const file = fileInput.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const result = validateFile(file, Math.round(maxFileSize), validTypes, t);
    if (!result) return;
    if (loading) return;
    setLoading(true);
    // Update profile
    const formData = new FormData();
    formData.append("profile", file);
    try {
      const response = await axiosClient.post(profile_upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status == 200) {
        // Change logged in user data
        await setUser({
          ...user,
          profile: response.data.profile,
        });
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
    /** Reset file input */
    if (e.currentTarget) {
      e.currentTarget.type = "text";
      e.currentTarget.type = "file"; // Reset to file type
    }
  };
  const deleteProfilePicture = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete(profile_delete_url);
      if (response.status == 200) {
        // Change logged in user data
        await setUser({
          ...user,
          profile: undefined,
        });
        toast({
          toastType: "SUCCESS",
          title: t("success"),
          description: response.data.message,
        });
      }
    } catch (error: any) {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: error.response.data.message,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="self-center text-center">
      <CachedImage
        src={user?.profile}
        alt="Avatar"
        shimmerClassName="size-[86px] !mt-6 mx-auto shadow-lg border border-primary/30 rounded-full"
        className="size-[86px] !mt-6 object-center object-cover mx-auto shadow-lg border border-primary/50 rounded-full"
        routeIdentifier={"profile"}
      />
      {loading && (
        <NastranSpinner
          label={t("in_progress")}
          className="size-[14px] mt-2"
          labelclassname="text-primary/80 rtl:text-sm-rtl ltr:text-sm-ltr"
        />
      )}
      <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
        <IconButton className="hover:bg-primary/20 transition-all text-primary">
          <label
            className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
          >
            <Pencil className={`size-[13px] pointer-events-none`} />
            <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>{t("choose")}</h1>
            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              className={`block w-0 h-0`}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onFileUploadChange(e);
              }}
            />
          </label>
        </IconButton>

        <IconButton
          className="hover:bg-red-400/30 transition-all border-red-400/40 text-red-400"
          onClick={deleteProfilePicture}
        >
          <Trash2 className="size-[13px] pointer-events-none" />
          <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("delete")}</h1>
        </IconButton>
      </div>

      <h1 className="text-primary font-semibold rtl:text-2xl-rtl ltr:text-4xl-ltr">
        {user?.username}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr">
        {user?.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {user?.contact}
      </h1>
    </div>
  );
}
