import SettingPage from "@/dashboard/settings/page";
import HomePage from "../dashboard/home/page";
import ParkingPage from "@/dashboard/parking/page";
import TariffsPage from "@/dashboard/settings/tariffs/page";
import UserPage from "@/dashboard/settings/users/page";
import LoginPage from "@/login/page";
import DashboardHome from "@/dashboard/home/page";
import path from "node:path";
import ParkingInfo from "@/dashboard/settings/parkingInfo/page";
import PaymentMethodsPage from "@/dashboard/settings/paymentMethods/page";

export const routes = [
  {
    path: "/",
    component: <LoginPage />,
    layout: "auth"
  },
  {
    path: "/home",
    component: <DashboardHome />,
    layout: "dashboard"
  },
  { path: "/home", component: <HomePage /> },
  { path: "/parking", component: <ParkingPage /> },
  { path: "/settings", component: <SettingPage /> },
  { path: "/settings/tariffs", component: <TariffsPage /> },
  { path: "/settings/users", component: <UserPage /> },
  { path: "/settings/parking-info", component: <ParkingInfo /> },
  { path: "/settings/payment-methods", component: <PaymentMethodsPage /> },

];
