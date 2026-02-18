import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import Header from "./dashboard/components/Header";
import Sidebar from "./dashboard/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <section className="grid grid-cols-[auto_2fr] h-screen">
          <Sidebar />
          <div className="grid grid-rows-[auto_1fr]">
            <Header />
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.component}
                />
              ))}
            </Routes>
          </div>
        </section>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;
