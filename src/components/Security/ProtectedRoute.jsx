import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const user = localStorage.getItem("userId");
  const tokenExpiration = localStorage.getItem("expiracionSesion");

  // Asegúrate de que `tokenExpiration` sea un número
  const currentTime = new Date().getTime();
  return user && tokenExpiration && currentTime < parseInt(tokenExpiration, 10);
};

const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();

  return isAuth ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;