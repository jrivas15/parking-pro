import { Outlet } from "react-router-dom";
import Header from "@/dashboard/components/Header";
import Sidebar from "@/dashboard/components/Sidebar";

export default function DashboardLayout() {
  return (
    <section className="grid grid-cols-[auto_2fr] h-screen overflow-y-hidden">
      <Sidebar />
      <div className="grid grid-rows-[auto_1fr]">
        <Header />
        <main className="overflow-auto">
          <Outlet />
        </main>
      </div>
    </section>
  );
}