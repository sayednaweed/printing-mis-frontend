import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";

export default function ErrorLayout() {
  return (
    <div className="flex flex-col min-h-[100vh] max-h-[100vh] bg-secondary overflow-auto">
      <Outlet />
      <Toaster />
    </div>
  );
}
