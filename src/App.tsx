import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routes/AppRoutes";
import Header from "./dashboard/components/Header";
import Sidebar from "./dashboard/components/Sidebar";

const App = () => {
  return (
    <Router>
      <section className="grid grid-cols-[auto_2fr] h-screen">
        <Sidebar/>
        <div className="grid grid-rows-[auto_1fr]">
          <Header />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.component} />
            ))}
          </Routes>
        </div>
      </section>
    </Router>
  );
};

export default App;
