import Navbar from "@/components/custom-ui/navbar/Navbar";
import NastranSidebar from "@/components/custom-ui/sidebar/NastranSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <section className="min-h-[100vh] max-h-[100vh] flex bg-secondary select-none">
      <NastranSidebar />
      <main className="min-h-full flex-1 flex flex-col overflow-auto">
        <Navbar />
        <Outlet />
      </main>
      <Toaster />
    </section>
  );
}
