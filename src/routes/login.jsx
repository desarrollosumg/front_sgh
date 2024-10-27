import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { notification } from "antd";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

//--------------------------------------------------------------------------------------------------------//
/**
 * Valida si una contraseña es correcta
 * @param {string} password // Clave a comparar
 * @param {string} hashedPassword // Hash de la clave guardada
 * @returns {boolean}
 */
export const validatePassword = (clave, hashedPassword) => {
  return bcrypt.compareSync(clave, hashedPassword);
};

const Home = () => {
  const [api, contextHolder] = notification.useNotification();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPasword, setShowPassword] = useState(false);
  const BaseAPiUrl = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  const handleGetUser = async () => {
    try {
      // Listamos el usuario segun correo
      const userInfoResponse = await axios.get(
        `${BaseAPiUrl}/usuario/obtener?correo=${email}`
      );
      const userInfo = userInfoResponse.data || {};

      const isValidPassword = validatePassword(password, userInfo?.clave || "");

      if (!userInfo || !isValidPassword) {
        api.warning({
          message: "Ocurrió un error al iniciar sesión",
          description: "El usuario o contraseña son incorrectos",
        });
        return;
      }

      if(userInfo.activo === 0){
        api.warning({
          message: "El usuario no se encuentra activo.",
          description: ""
        });
        return;
      }

      localStorage.setItem("userId", userInfo.id);
      localStorage.setItem("nombre_usuario", userInfo.nombre_usuario);
      // Guardar fecha de expiración de la sesión
      const tiempoExpiracion = new Date().getTime() + 8 * 60 * 60 * 1000;
      localStorage.setItem("expiracionSesion", tiempoExpiracion);

      navigate(`/cita`);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      api.error({
        message: "Ocurrió un error al iniciar sesión.",
        description:
          "Por favor, inténtelo nuevamente. Si el problema persiste, contacte a su administrador.",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div
        style={{ backgroundImage: 'url("/wallpaper-login-3.jpg")' }}
        className="w-screen h-screen bg-cover bg-no-repeat flex justify-center items-center"
      >
        <div className="rounded-[10px] bg-black bg-opacity-30 backdrop-blur-login w-[300px] h-[300px] py-2">
          <h1 className="w-full text-center text-white text-2xl md:text-3xl">
            Iniciar Sesión
          </h1>
          <div className="w-full mt-6 px-5">
            <div className="relative">
              <input
                type="text"
                className="w-full py-1 px-2 rounded-3xl border border-white bg-inherit outline-none text-white"
                placeholder="Correo"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaUser className="text-white" />
              </div>
            </div>
            <div className="relative mt-3 md:mt-5">
              <input
                type={showPasword ? "text" : "password"}
                className="w-full py-1 px-2 rounded-3xl border border-white bg-inherit outline-none text-white"
                placeholder="Clave"
                value={password}
                onChange={(event) => {
                  const value = event.target.value;
                  setPassword(value);
                  if (value === "") setShowPassword(false);
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {!password && <TbPasswordUser className="text-white" />}
                {!!password && !showPasword && (
                  <IoEye
                    className="text-white"
                    onClick={() => setShowPassword(true)}
                  />
                )}
                {!!password && showPasword && (
                  <IoEyeOff
                    className="text-white"
                    onClick={() => setShowPassword(false)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-10">
            <button
              onClick={handleGetUser}
              className="border border-white rounded-3xl px-8 py-1 text-white"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
