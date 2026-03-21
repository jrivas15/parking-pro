import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { sileo, Toaster } from "sileo";
import NotFound404 from "./NotFound404";

const App = () => {
  const queryClient = new QueryClient();

  // separa rutas por layout
  const authRoutes = routes.filter((r) => r.layout === "auth");
  const dashboardRoutes = routes.filter(
    (r) => r.layout === "dashboard" || !r.layout,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rutas de autenticación */}
          <Route element={<AuthLayout />}>
            {authRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
          </Route>

          {/* Rutas del dashboard */}
          <Route element={<DashboardLayout />}>
            {dashboardRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
          </Route>
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </Router>

      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster
        position="top-center"
        options={{
          fill: "#171717",
          roundness: 16,
          styles: {
            title: "text-white!",
            description: "text-white/75!",
            badge: "bg-white/10!",
            button: "bg-white/10! hover:bg-white/15!",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
