import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom";

import {
  useContext
} from "react";

import {
  ThemeContext
} from "./context/ThemeContext";

import {
  ToastContainer
} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddDelivery from "./pages/AddDelivery";
import DeliveryRecords from "./pages/DeliveryRecords";
import AISummary from "./pages/AISummary";
import EditDelivery from "./pages/EditDelivery";

function Layout() {

  const location = useLocation();

  const {
    darkMode
  } = useContext(ThemeContext);

  const hideSidebarRoutes = ["/"];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  const protect = (component) => (
    <ProtectedRoute>
      {component}
    </ProtectedRoute>
  );

  return (

    <div className="flex h-screen overflow-hidden">

      {showSidebar && <Sidebar />}

      <div
        className={`flex-1 p-8 overflow-y-auto transition-all ${
          darkMode
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-black"
        }`}
      >

        <Routes>

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/dashboard"
            element={protect(<Dashboard />)}
          />

          <Route
            path="/add-delivery"
            element={protect(<AddDelivery />)}
          />

          <Route
            path="/records"
            element={protect(<DeliveryRecords />)}
          />

          <Route
            path="/ai-summary"
            element={protect(<AISummary />)}
          />

          <Route
            path="/edit/:id"
            element={protect(<EditDelivery />)}
          />

        </Routes>

      </div>

    </div>

  );
}

function App() {

  return (

    <BrowserRouter>

      <Layout />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

    </BrowserRouter>

  );
}

export default App;