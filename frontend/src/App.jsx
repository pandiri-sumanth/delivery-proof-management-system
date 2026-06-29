import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddDelivery from "./pages/AddDelivery";
import DeliveryRecords from "./pages/DeliveryRecords";
import AISummary from "./pages/AISummary";
import EditDelivery from "./pages/EditDelivery";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

function App() {

  const protect = (component, allowedRoles) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      {component}
    </ProtectedRoute>
  );

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={protect(<Dashboard />, ["Admin", "Operations Staff", "Logistics Manager"])}
          />

          <Route
            path="/add-delivery"
            element={protect(<AddDelivery />, ["Admin", "Operations Staff", "Warehouse Staff"])}
          />

          <Route
            path="/records"
            element={protect(<DeliveryRecords />)} // All auth users can view list
          />

          <Route
            path="/ai-summary"
            element={protect(<AISummary />, ["Admin", "Operations Staff", "Logistics Manager"])}
          />

          <Route
            path="/edit/:id"
            element={protect(<EditDelivery />, ["Admin", "Operations Staff", "Warehouse Staff", "Documentation Executive"])}
          />

        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

    </BrowserRouter>

  );

}

export default App;