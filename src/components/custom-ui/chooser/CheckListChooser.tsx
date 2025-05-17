import { Check, CloudUpload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import React, { useRef, useState } from "react";
import UploadButton from "@rpldy/upload-button";
import ChunkedUploady from "@rpldy/chunked-uploady";
import { isFile } from "@/validation/utils";
import SimpleProgressBar from "./SimpleProgressBar";
import { FileType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Downloader from "./Downloader";
export interface CheckListProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  requiredHint?: string;
  name: string;
  number?: string;
  errorMessage?: string;
  defaultFile?: File | FileType;
  disabled?: boolean;
  downloadParam?: { path: string; fileName: string };
  onComplete: (record: any) => Promise<void>;
  onStart: (file: File) => Promise<void>;
  url: string;
  uploadParam?: any;
  headers: any;
  hasEdit?: boolean;
  onFailed: (failed: boolean, response: any) => void;
  validateBeforeUpload: (file: File) => boolean;
}

const CheckListChooser = React.forwardRef<HTMLInputElement, CheckListProps>(
  (props, _ref: any) => {
    const {
      defaultFile,
      onComplete,
      onStart,
      url,
      headers,
      uploadParam,
      name,
      number,
      accept,
      className,
      hasEdit,
      onFailed,
      validateBeforeUpload,
    } = props;
    const { t } = useTranslation();
    const [uploaded, setUploaded] = useState(false);
    const downloadRef = useRef<HTMLLIElement>(null);
    const lockUpload = (lock: boolean) => {
      if (downloadRef.current) {
        downloadRef.current.style.pointerEvents = lock ? "none" : "auto";
        downloadRef.current.style.opacity = lock ? "0.5" : "1";
      }
    };
    return (
      <ul
        className={cn(
          "grid grid-cols-1 gap-y-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-x-6 border-t pt-1",
          className
        )}
      >
        {number && <li className="text-[14px] font-semibold">{number}.</li>}
        <li className="ltr:text-md-ltr rtl:text-md-rtl font-semibold">
          {name}
        </li>
        <li className="grid grid-cols-[auto_1fr_1fr] items-start gap-x-2 rtl:text-lg-rtl ltr:text-lg-ltr font-semibold">
          {uploaded || defaultFile?.name ? (
            <Check className="size-[22px] text-green-500 rounded-sm" />
          ) : (
            <X className="size-[24px] text-red-500 rounded-full" />
          )}
          {isFile(defaultFile) ? (
            <h1 className="text-[14px]">{defaultFile?.name}</h1>
          ) : (
            defaultFile?.name && (
              <>
                <h1 className="text-[14px] font-normal">{defaultFile?.name}</h1>
                <Downloader
                  cancelText={t("cancel")}
                  filetoDownload={defaultFile}
                  downloadText={t("download")}
                  errorText={t("error")}
                  lockUpload={lockUpload}
                  apiUrl={"temp/media"}
                />
              </>
            )
          )}
        </li>
        {hasEdit && (
          <li className="flex justify-start" ref={downloadRef}>
            <ChunkedUploady
              withCredentials={true}
              method="POST"
              destination={{
                url: url,
                headers: headers,
                params: uploadParam,
              }}
              chunkSize={500000}
              inputFieldName={"file"}
              accept={accept}
            >
              <div className="grid grid-cols-1 items-start gap-y-1">
                <UploadButton text="">
                  <label className="flex flex-col items-center justify-center h-full transition-opacity duration-150 cursor-pointer hover:opacity-80">
                    <CloudUpload className="size-[30px] bg-primary text-primary-foreground rounded-full p-[4px]" />
                    <strong className="ltr:text-md-ltr rtl:text-lg-rtl font-medium text-primary-text">
                      {t("select_a")}
                    </strong>
                  </label>
                </UploadButton>

                <SimpleProgressBar
                  onStart={async (file: File) => {
                    onStart(file);
                  }}
                  onFailed={async (failed: boolean, response: any) => {
                    if (failed) {
                      onFailed(failed, response);
                      setUploaded(false);
                    }
                  }}
                  onComplete={async (response: any) => {
                    setUploaded(true);
                    await onComplete(response);
                  }}
                  cancelText={t("cancel")}
                  failedText={t("failed")}
                  validateBeforeUpload={validateBeforeUpload}
                />
              </div>
            </ChunkedUploady>
          </li>
        )}
      </ul>
    );
  }
);

export default CheckListChooser;
