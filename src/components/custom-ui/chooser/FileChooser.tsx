import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import axiosClient from "@/lib/axois-client";
import { cn } from "@/lib/utils";
import { ArrowDownToLine, Paperclip, Trash2 } from "lucide-react";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
export interface FileType {
  path: string;
  name: string;
}
export interface FileChooserProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  lable: string;
  parentClassName?: string;
  errorMessage?: string;
  defaultFile: File | FileType;
  maxSize: number;
  validTypes: string[];
  disabled?: boolean;
  downloadParam?: { path: string; fileName: string };
  onchange: (file: File | undefined) => void;
}
const FileChooser = React.forwardRef<HTMLInputElement, FileChooserProps>(
  (props, ref: any) => {
    const {
      className,
      requiredHint,
      errorMessage,
      required,
      lable,
      defaultFile,
      maxSize,
      validTypes,
      disabled,
      downloadParam,
      parentClassName,
      onchange,
      ...rest
    } = props;
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const { t } = useTranslation();
    const [userData, setUserData] = useState<File | FileType | undefined>(
      defaultFile
    );
    const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const fileInput = e.target;
      const maxFileSize = maxSize * 1024 * 1024; // 2MB

      if (!fileInput.files) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("no_file_was_chosen"),
        });
        resetFile(e);
        return;
      }

      if (!fileInput.files || fileInput.files.length === 0) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("files_list_is_empty"),
        });
        resetFile(e);
        return;
      }

      const file = fileInput.files[0];
      if (file.size >= maxFileSize) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t(`img_size_shou_less`) + ` ${maxSize}MB`,
        });
        resetFile(e);
        return;
      }
      /** Type validation */
      if (!validTypes.includes(file.type)) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: t("accept_types") + validTypes.join(", "),
        });
        resetFile(e);
        return;
      }
      setUserData(file);
      onchange(file);
      /** Reset file input */
      resetFile(e);
    };
    const deleteFile = async () => {
      setUserData(undefined);
      onchange(undefined);
    };
    const resetFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.currentTarget) {
        e.currentTarget.type = "text";
        e.currentTarget.type = "file"; // Reset to file type
      }
    };
    const download = async () => {
      // 2. Store
      try {
        setIsDownloading(true);
        const response = await axiosClient.get(`media/${downloadParam?.path}`, {
          responseType: "blob", // Important to handle the binary data (PDF)
          onDownloadProgress: (progressEvent) => {
            // Calculate download progress percentage
            const total = progressEvent.total || 0;
            const current = progressEvent.loaded;
            const progress = Math.round((current / total) * 100);
            setDownloadProgress(progress); // Update progress state
          },
        });
        if (response.status == 200) {
          // Create a URL for the file blob
          const file = new Blob([response.data], { type: "application/pdf" });
          const fileURL = window.URL.createObjectURL(file);

          const link = document.createElement("a");
          link.href = fileURL;
          link.download = downloadParam
            ? downloadParam.fileName
            : "downloadParam_problem.txt"; // Default download filename
          link.click();

          // Clean up the URL object after download
          window.URL.revokeObjectURL(fileURL);
        }
      } catch (error: any) {
        toast({
          toastType: "ERROR",
          title: t("error"),
          description: error.response.data.message,
        });
        console.log(error);
      }
      setIsDownloading(false); // Reset downloading state
    };
    return (
      <div
        className={cn(
          `flex sm:grid sm:grid-cols-[auto_1fr] relative ${
            errorMessage && "mb-2"
          }`,
          parentClassName
        )}
      >
        <Label
          htmlFor="initail_scan"
          className={`w-fit rounded-s-md py-3 shadow-md bg-primary px-4 hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-x-3 text-primary-foreground`}
        >
          <h1 className="rtl:text-lg-rtl font-semibold ltr:text-lg-ltr pb-[1px] cursor-pointer">
            {lable}
          </h1>
          <input
            disabled={disabled}
            onChange={onFileChange}
            {...rest}
            ref={ref}
            type="file"
            id="initail_scan"
            className={cn("hidden cursor-pointer", className)}
          />
          <Paperclip className="min-h-[18px] min-w-[18px] size-[18px] cursor-pointer" />
        </Label>
        {isDownloading ? (
          <div className="relative bg-primary/10 ltr:rounded-r-sm rtl:rounded-l-sm">
            <div
              style={{
                width: `${downloadProgress}%`,
              }}
              className="ltr:rounded-r-sm rtl:rounded-l-sm ltr:text-xl-ltr rtl:text-xl-rtl rtl:pt-1 font-medium bg-tertiary transition-[width] ease-linear duration-500 absolute w-full h-full flex justify-center items-center"
            >
              {downloadProgress > 1 && <h1>{downloadProgress}%</h1>}
            </div>
          </div>
        ) : (
          <label
            htmlFor="initail_scan"
            className={`bg-card dark:!bg-black/30 flex items-center justify-between px-3 border rounded-e-md flex-1 rtl:text-lg-rtl ltr:text-md-ltr ${
              errorMessage && "border-red-400"
            }`}
          >
            {userData ? (
              <>
                {!(userData instanceof File) ? (
                  <>
                    {userData.name}
                    <ArrowDownToLine
                      onClick={download}
                      className="inline-block cursor-pointer min-h-[18px] min-w-[18px] size-[18px] text-primary/90 ltr:ml-2 rtl:mr-2"
                    />
                  </>
                ) : (
                  <>
                    <h1 className="rtl:pt-1"> {userData?.name}</h1>
                    <Trash2
                      onClick={deleteFile}
                      className="inline-block cursor-pointer text-red-500 min-h-[18px] min-w-[18px] size-[18px] ltr:ml-2 rtl:mr-2"
                    />
                  </>
                )}
              </>
            ) : (
              t("no_file_was_chosen")
            )}
          </label>
        )}
        {required && (
          <span className="text-red-600 rtl:text-[13px] ltr:text-[11px] ltr:right-[10px] rtl:left-[10px] -top-[17px] absolute font-semibold">
            {requiredHint}
          </span>
        )}
        {errorMessage && (
          <h1 className="rtl:text-md-rtl ltr:text-sm-ltr absolute -bottom-[24px] capitalize text-start text-red-400">
            {errorMessage}
          </h1>
        )}
      </div>
    );
  }
);

export default FileChooser;
