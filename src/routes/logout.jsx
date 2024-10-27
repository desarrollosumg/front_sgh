import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const sessionId = localStorage.getItem("session");
      const baseApiUrl = process.env.REACT_APP_API_BASE_URL;

      //listamos la informacion de la sesión actual
      const sessionInfoResponse = await axios.get(
        `${baseApiUrl}/sesion/${sessionId}`
      );
      const sessionInfo = sessionInfoResponse.data;

      //actualizamos el cierre de sesion
      const date = new Date();

      await axios.put(`${baseApiUrl}/sesion`, {
        ...sessionInfo,
        logout_time: date.toISOString(),
      });

      localStorage.clear(); // Limpia el localStorage
      navigate("/"); // Redirige a la página de inicio
    };

    fetchData();
  }, []);

  return <div></div>;
};

export default Logout;
