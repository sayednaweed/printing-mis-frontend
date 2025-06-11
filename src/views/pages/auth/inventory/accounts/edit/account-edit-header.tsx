import IconButton from "@/components/custom-ui/button/IconButton";
import { Pencil, Trash2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "@/lib/axois-client";
import NastranSpinner from "@/components/custom-ui/spinner/NastranSpinner";
import CachedImage from "@/components/custom-ui/image/CachedImage";
import { validateFile } from "@/lib/utils";
import { Party } from "@/database/tables";

export interface SellersEditHeaderProps {
  id: string | undefined;
  userData: Party | undefined;
  failed: boolean;
  setUserData: Dispatch<SetStateAction<Party | undefined>>;
}

export default function AccountEditHeader(props: SellersEditHeaderProps) {
  const { id, userData, setUserData, failed } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);

  const onFileUploadChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const validTypes: string[] = ["image/jpeg", "image/png", "image/jpg"];
    const fileInput = e.target;
    if (!fileInput.files || fileInput.files.length === 0) {
      return;
    }

    const checkFile = fileInput.files[0] as File;
    const file = validateFile(
      checkFile,
      Math.round(maxFileSize),
      validTypes,
      t
    );
    if (file) {
      if (loading) return;
      setLoading(true);
      // Upload data
      const formData = new FormData();
      if (id !== undefined) formData.append("id", id);
      formData.append("logo", file);
      try {
        const response = await axiosClient.post(
          `sellers/update/logo`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == 200 && userData) {
          // Change logged in user data
          setUserData({
            ...userData,
            logo: response.data.logo,
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
    }
  };
  const deleteLogoPicture = async () => {
    if (userData?.logo == "") {
      toast({
        toastType: "ERROR",
        title: t("error"),
        description: t("no_img_selected"),
        duration: 3000,
      });
      return;
    }
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosClient.delete(`sellers/delete/logo/${id}`);
      if (response.status == 200 && userData) {
        // Change logged in user data
        setUserData({
          ...userData,
          logo: undefined,
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
        src={userData?.logo}
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
      {userData && !failed && (
        <div className="flex self-center justify-center !mt-2 !mb-6 gap-x-4">
          <IconButton className="hover:bg-primary/20 transition-all text-primary">
            <label
              className={`flex w-fit gap-x-1 items-center cursor-pointer justify-center`}
            >
              <Pencil className={`size-[13px] pointer-events-none`} />
              <h1 className={`rtl:text-lg-rtl ltr:text-md-ltr`}>
                {t("choose")}
              </h1>
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
            onClick={deleteLogoPicture}
          >
            <Trash2 className="size-[13px] pointer-events-none" />
            <h1 className="rtl:text-lg-rtl ltr:text-md-ltr">{t("delete")}</h1>
          </IconButton>
        </div>
      )}

      <h1 className="text-primary font-semibold rtl:text-2xl-rtl ltr:text-4xl-ltr">
        {userData?.name}
      </h1>
      <h1
        dir="ltr"
        className="text-primary rtl:text-md-rtl ltr:text-xl-ltr font-bold"
      >
        {userData?.company_name}
      </h1>
      <h1 className="leading-6 rtl:text-sm-rtl ltr:text-2xl-ltr">
        {userData?.email}
      </h1>
      <h1 dir="ltr" className="text-primary rtl:text-md-rtl ltr:text-xl-ltr">
        {userData?.contact}
      </h1>
    </div>
  );
}
