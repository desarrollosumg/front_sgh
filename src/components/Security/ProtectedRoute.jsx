import { Navigate } from "react-router-dom";

export const isAuthenticated = () => {
  const user = localStorage.getItem("userId");
  const tokenExpiration = localStorage.getItem("expiracionSesion");

  // Asegúrate de que `tokenExpiration` sea un número
  const currentTime = new Date().getTime();
  return user && tokenExpiration && currentTime < parseInt(tokenExpiration, 10);
};

const ProtectedRoute = ({ moduleId, children }) => {
  const isAuth = isAuthenticated();
  const modules = JSON.parse(localStorage.getItem("modulos") || "[]");
  
  const availableModule = modules.find((module) => module.id == moduleId);

  if (availableModule || moduleId === 0) {
    return isAuth ? children : <Navigate to="/" replace />;
  } else {
    return isAuth ? (
      <Navigate to="/home" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }
};

export default ProtectedRoute;
