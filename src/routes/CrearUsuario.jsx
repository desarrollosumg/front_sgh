import { useEffect, useState } from "react";
import { MainLayout } from "../components/Layout/MainLayout";
import axios from "axios";
import Swal from "sweetalert2";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

/*--------------------------------------------------------------------------------------------------------*/
/**
 * Encripta una contraseña
 * @param passwordString
 * @returns
 */
export const getEncryptedPassword = async (passwordString) => {
  try {
    const salt = await bcrypt.genSalt(
      Number(process.env.REACT_APP_BCRYPT_SALT)
    );
    const hashedPassword = bcrypt.hashSync(passwordString, salt);
    return hashedPassword;
  } catch (er) {
    throw new Error(`Error al guardar contraseña: ${er}`);
  }
};

const CrearUsario = () => {
  const baseApiUrl = process.env.REACT_APP_API_BASE_URL;
  const [roleList, setRoleList] = useState([]);
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const [user, setUser] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    clave: "",
    rol_id: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleListResponse = await axios.get(`${baseApiUrl}/listarRol`);
        const _roleList = roleListResponse.data || [];

        setRoleList(
          _roleList
            .filter((role) => role.id != 1)
            .map((role) => {
              return {
                value: role.id,
                label: role.nombre,
              };
            })
        );
      } catch (error) {
        console.error("Error al cargar la pagina", error);
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error al cargar el catálogo.",
          text: "Por favor, inténtelo nuevamente. Si el problema persiste, contacte a su administrador.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };

    fetchData();
  }, []);

  const failConditions = [
    {
      condition: user.nombre_usuario.length <= 0,
      title: "El nombre no puede estar vacío",
      text: "",
    },
    {
      condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.correo_electronico),
      title: "El correo no tiene un formato valido",
      text: "",
    },
    {
      condition: user.clave.length <= 0,
      title: "La clave no puede estar vacío.",
      text: "",
    },
    {
      condition: user.clave !== confirmedPassword,
      title: "La clave y confirmación no coinciden.",
      text: "",
    },
    {
      condition: user.rol_id == 0,
      title: "EL rol no puede estar vacío.",
      text: "",
    },
  ];

  const createUser = async () => {
    const failCondition = failConditions.find(
      (condition) => condition.condition
    );
    if (failCondition) {
      Swal.fire({
        icon: "warning",
        title: failCondition.title,
        text: failCondition.text,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    try {
      // Listamos el usuario segun correo
      const userInfoResponse = await axios.get(
        `${baseApiUrl}/usuario/obtener?correo=${user.correo_electronico}`
      );

      if (userInfoResponse.data) {
        Swal.fire({
          icon: "error",
          title: "Ocurrió un error al crear el usuario.",
          text: "El correo ya ha sido registrado anteriormente.",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }

      setIsCreating(true);

      const date = new Date();
      const dateGt = new Date(date.getTime() - 6 * 60 * 60 * 1000);
      const userId = localStorage.getItem("userId");
      const encryptedPassword = await getEncryptedPassword(user.clave);

      await axios.post(`${baseApiUrl}/usuario`, {
        ...user,
        activo: 1,
        clave: encryptedPassword,
        usuario_creador: userId,
        fecha_creacion: dateGt.toISOString(),
        usuario_modificacion: userId,
        fecha_modificacion: dateGt.toISOString(),
      });
      await Swal.fire({
        icon: "success",
        title: "¡Perfecto!",
        text: "El usuario ha sido creado exitosamente.",
        showConfirmButton: false,
        timer: 3000,
      });
      navigate("/usuarios");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error al crear el usuario.",
        text: "Por favor, intente nuevamente. Si el problema persiste contacte a su administrador.",
        showConfirmButton: false,
        timer: 3000,
      });
    }
    setIsCreating(false);
    return;
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-md mt-10">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Crear usuario
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={user.nombre_usuario}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => {
                setUser({ ...user, nombre_usuario: event.target.value });
              }}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={user.correo_electronico}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => {
                setUser({ ...user, correo_electronico: event.target.value });
              }}
            />
            <input
              type="password"
              placeholder="Clave"
              value={user.clave}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => {
                setUser({ ...user, clave: event.target.value });
              }}
            />
            <input
              type="password"
              placeholder="Clave"
              value={confirmedPassword}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) => setConfirmedPassword(event.target.value)}
            />
            <select
              value={user.rol_id}
              required
              className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(event) =>
                setUser({ ...user, rol_id: Number(event.target.value) })
              }
            >
              <option value="0" disabled>
                Seleccione un Rol
              </option>
              {roleList.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-black text-white font-bold py-2 px-6 rounded-md hover:bg-blue-600 transition disabled:cursor-not-allowed"
              onClick={() => createUser()}
              disabled={isCreating}
            >
              {isCreating ? (
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
              ) : (
                "Crear Usuario"
              )}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CrearUsario;
