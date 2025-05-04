import { useEffect, useState } from "react";

export interface Log {
  created_at: string;
  error_message: string;
  username: string;
  user_id: number | string;
  ip_address: string;
  method: string;
  exception_type: string;
  error_code: string;
  uri: string;
}

export interface LogsResponse {
  status: string;
  logs: Log[];
}
import axiosClient from "@/lib/axois-client";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { LockKeyhole } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbHome,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/custom-ui/Breadcrumb/Breadcrumb";

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleGoHome = () => navigate("/dashboard", { replace: true });

  useEffect(() => {
    // Fetch logs when the component mounts
    fetchLogs();
  }, []);

  // Function to fetch logs from the API
  const fetchLogs = async () => {
    try {
      const response = await axiosClient.get<LogsResponse>("database-logs");
      if (response.data.status === "success") {
        setLogs(response.data.logs);
      } else {
        setErrorMessage("No logs found.");
      }
    } catch (error) {
      setErrorMessage("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 pt-2 flex flex-col gap-y-[2px] relative select-none rtl:text-2xl-rtl ltr:text-xl-ltr">
      <Breadcrumb>
        <BreadcrumbHome onClick={handleGoHome} />
        <BreadcrumbSeparator />
        <BreadcrumbItem>{t("logs")}</BreadcrumbItem>
      </Breadcrumb>
      <div className=" flex flex-col items-center my-auto h-full justify-center mt-32 bg-primary/5 w-fit mx-auto rounded-xl p-6 gap-y-2">
        <LockKeyhole className="text-orange-500 size-[32px]" />
        <h1 className="text-[20px] text-justify">{t("under_testing")}</h1>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          User Error Log Viewer
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            {errorMessage ? (
              <div className="text-red-500 text-center">{errorMessage}</div>
            ) : (
              <div className="space-y-4">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{log.created_at}</span>
                      <span className="bg-primary text-primary-foreground rounded-md p-1">
                        {log.method}
                      </span>
                    </div>
                    <h3 className="text-xl text-wrap font-semibold text-red-500">
                      {log.error_message}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      <strong>User ID:</strong> {log.user_id}
                    </p>
                    <p className="text-gray-600">
                      <strong>Username:</strong> {log.username}
                    </p>
                    <p className="text-gray-600">
                      <strong>Error Code:</strong> {log.error_code}
                    </p>
                    <p className="text-gray-600">
                      <strong>Exception Type:</strong> {log.exception_type}
                    </p>
                    <p className="text-gray-600">
                      <strong>IP Address:</strong> {log.ip_address}
                    </p>
                    <p className="text-gray-600 break-words">
                      <strong>URI:</strong> {log.uri}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LogsPage;
