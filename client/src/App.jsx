import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Budgets from "./pages/Budgets";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";

const PrivateRoute = ({ children }) => {
  return localStorage.getItem("token")
    ? children
    : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <PrivateRoute>
              <Expenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <PrivateRoute>
              <Budgets />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}