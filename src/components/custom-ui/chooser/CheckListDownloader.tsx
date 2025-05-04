import { FileType } from "@/lib/types";
import Downloader from "./Downloader";
import { useTranslation } from "react-i18next";
import { byteTokb, cn } from "@/lib/utils";

export interface CheckListDownloaderProps {
  document: FileType;
  index: number;
  checklist_name: string;
  className?: string;
  apiUrl: string;
  params: any;
}

export default function CheckListDownloader(props: CheckListDownloaderProps) {
  const { document, index, checklist_name, className, apiUrl, params } = props;
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-y-1 sm:grid-cols-[auto_1fr_auto_1fr_auto] gap-x-6 border-t pt-1",
        className
      )}
      key={index}
    >
      <h1 className="text-[14px] font-semibold">{index + 1}.</h1>
      <h1 className="ltr:text-md-ltr rtl:text-md-rtl font-semibold">
        {checklist_name}
      </h1>
      <Downloader
        key={index}
        cancelText={t("cancel")}
        filetoDownload={document}
        downloadText={t("download")}
        errorText={t("error")}
        apiUrl={apiUrl}
        params={params}
      />
      <h1 className="text-[14px]">{document.name}</h1>
      <h1 className="text-[14px]" dir="ltr">
        {byteTokb(document.size)}
      </h1>
    </div>
  );
}
