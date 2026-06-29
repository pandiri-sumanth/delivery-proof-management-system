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

function App() {

  const protect = (component) => (
    <ProtectedRoute>
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

        </Route>

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