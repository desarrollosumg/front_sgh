import React, { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { TbPasswordUser } from "react-icons/tb";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { notification } from "antd";
//import axios from "axios";
//import SHA256 from "crypto-js/sha256"; // Importamos SHA256 para encriptar la clave en el login

const Home = () => {
  const [api, contextHolder] = notification.useNotification();
  const [nombreusuario, setNombreUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [esVisibleClave, setEsVisibleClave] = useState(false);

  const handleGetUser = async () => {/*
    try {
      const response = await axios.get(
        `http://localhost:8081/rrhh/usuario/obtener?nombreUsuario=${nombreusuario}`
      );

      // Verificamos si existe el usuario
      if (!response.data) {
        api.warning({
          message: "Ocurrió un error al iniciar sesión",
          description: "El usuario o contraseña son incorrectos",
        });
        return;
      }

      const userInfo = response.data;

      // Encriptar la clave ingresada por el usuario con SHA-256
      const claveIngresadaEncriptada = SHA256(clave).toString();

      // Comparar la clave encriptada del usuario con la que está en la base de datos
      const claveEncriptadaBD = userInfo?.clave || "";
      if (claveIngresadaEncriptada !== claveEncriptadaBD) {
        api.warning({
          message: "Ocurrió un error al iniciar sesión",
          description: "El usuario o contraseña son incorrectos",
        });
        return;
      }

      // Guardamos el ID y nombre de usuario en localStorage
      localStorage.setItem("idUsuario", userInfo.id);
      localStorage.setItem("nombreUsuario", userInfo.nombreUsuario);

      // Guardar fecha de expiración de la sesión
      const tiempoExpiracion = new Date().getTime() + 8 * 60 * 60 * 1000;
      localStorage.setItem("expiracionSesion", tiempoExpiracion);

      // Redirigimos al usuario
      window.location.href = "/empleado";
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      api.error({
        message: "Ocurrió un error al iniciar sesión.",
        description:
          "Por favor, inténtelo nuevamente. Si el problema persiste, contacte a su administrador.",
      });
    }
  */};

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
                placeholder="Usuario"
                value={nombreusuario}
                onChange={(event) => {
                  setNombreUsuario(event.target.value);
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <FaUser className="text-white" />
              </div>
            </div>
            <div className="relative mt-3 md:mt-5">
              <input
                type={esVisibleClave ? "text" : "password"}
                className="w-full py-1 px-2 rounded-3xl border border-white bg-inherit outline-none text-white"
                placeholder="Clave"
                value={clave}
                onChange={(event) => {
                  const valor = event.target.value;
                  setClave(valor);
                  if (valor === "") setEsVisibleClave(false);
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {clave === "" && <TbPasswordUser className="text-white" />}
                {clave !== "" && !esVisibleClave && (
                  <IoEye
                    className="text-white"
                    onClick={() => setEsVisibleClave(true)}
                  />
                )}
                {clave !== "" && esVisibleClave && (
                  <IoEyeOff
                    className="text-white"
                    onClick={() => setEsVisibleClave(false)}
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
