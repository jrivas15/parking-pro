import HomePage from "../dashboard/home/page";
import ParkingPage from "@/dashboard/parking/page";

export const routes = [
  { path: "/", component: <HomePage /> },
  { path: "/parking", component: <ParkingPage /> },

];
