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
import BalancePage from "@/dashboard/tools/balance/page";
import TaxesPage from "@/dashboard/settings/taxes/page";
import ToolsPage from "@/dashboard/tools/page";
import CashCountPage from "@/dashboard/tools/cashCount/page";
import VehiclesPage from "@/dashboard/vehicles/page";
import MonthlyPaymentPage from "@/dashboard/vehicles/monthlyPayment/page";
import CreateVehiclePage from "@/dashboard/vehicles/vehicle/page";
import ClientsPage from "@/dashboard/customers/page";
import CustomersListPage from "@/dashboard/customers/customer/page";
import ExpensesPage from "@/dashboard/tools/expenses/page";
import VipPage from "@/dashboard/vehicles/vip/page";
import AdministrationPage from "@/dashboard/administration/page";
import ReportsPage from "@/dashboard/administration/reports/page";
import SalesClosingsPage from "@/dashboard/administration/salesClosings/page";
import PrinterSettingsPage from "@/dashboard/settings/printer/page";

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
  { path: "/tools/balance", component: <BalancePage /> },
  { path: "/settings/taxes", component: <TaxesPage /> },
  { path: "/tools", component: <ToolsPage /> },
  { path: "/tools/cash-count", component: <CashCountPage /> },
  { path: "/vehicles", component: <VehiclesPage /> },
  { path: "/vehicles/mensualidades", component: <MonthlyPaymentPage /> },
  { path: "/vehicles/vehiculos", component: <CreateVehiclePage /> },
  { path: "/clients", component: <ClientsPage /> },
  { path: "/clients/clientes", component: <CustomersListPage /> },
  { path: "/tools/expenses", component: <ExpensesPage /> },
  { path: "/vehicles/vip", component: <VipPage /> },
  { path: "/administration", component: <AdministrationPage /> },
  { path: "/administration/reports", component: <ReportsPage /> },
  { path: "/administration/sales-closings", component: <SalesClosingsPage /> },
  { path: "/settings/printer", component: <PrinterSettingsPage /> },
];
