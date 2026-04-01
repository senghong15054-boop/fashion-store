import { Navigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminRoute({ children }) {
  const { token } = useAdmin();
  return token ? children : <Navigate to="/admin" replace />;
}
