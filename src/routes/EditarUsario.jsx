import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { MainLayout } from "../components/Layout/MainLayout";
import { validatePassword } from "./login";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { getEncryptedPassword } from "./CrearUsuario";

const EditarUsuario = () => {
  const baseApiUrl = process.env.REACT_APP_API_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmedNewPassword] = useState("");
  const [user, setUser] = useState({
    nombre_usuario: "",
    correo_electronico: "",
    clave: "",
    activo: 1,
    rol_id: 0,
    usuario_creador: 0,
    fecha_creacion: new Date().toISOString(),
    usuario_modificacion: 0,
    fecha_modificacion: new Date().toISOString(),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoRespose = await axios.get(`${baseApiUrl}/usuario/${id}`);
        const roleListResponse = await axios.get(`${baseApiUrl}/listarRol`);

        const userInfo = userInfoRespose.data;
        const listRoles = roleListResponse.data || [];

        setUser(userInfo);
        setNewEmail(userInfo.correo_electronico);
        setRoleList(
          listRoles
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
      title: "El nombre no puede estar vacío.",
      text: "",
    },
    {
      condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail),
      title: "El correo no tiene un formato valido",
      text: "",
    },
    {
      condition:
        oldPassword.length == 0 &&
        (newPassword.length > 0 || confirmNewPassword.length > 0),
      title: "La clave actual no puede estar vacío.",
      text: "",
    },
    {
      condition: oldPassword.length > 0 && newPassword.length == 0,
      title: "La nueva clave no puede estar vacío.",
      text: "",
    },
    {
      condition:
        oldPassword.length > 0 && !validatePassword(oldPassword, user.clave),
      title: "La clave actual es incorrecta.",
      text: "",
    },
    {
      condition: oldPassword.length > 0 && newPassword != confirmNewPassword,
      title: "La nueva clave no coincide con la confirmación de clave.",
      text: "",
    },
  ];

  const editUser = async () => {
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

      if(user.correo_electronico != newEmail){
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
      }

      setIsEditing(true);
      const date = new Date();
      const dateGt = new Date(date.getTime() - 6 * 60 * 60 * 1000);
      const userId = localStorage.getItem("userId");
      const encryptedPassword = await getEncryptedPassword(newPassword);

      await axios.put(`${baseApiUrl}/usuario`, {
        ...user,
        activo: 1,
        clave: oldPassword.length > 0 ? encryptedPassword : user.clave,
        usuario_modificacion: userId,
        fecha_modificacion: dateGt.toISOString(),
      });
      await Swal.fire({
        icon: "success",
        title: "¡Perfecto!",
        text: "El usuario ha sido modificado exitosamente.",
        showConfirmButton: false,
        timer: 3000,
      });
      navigate("/usuarios");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error al modificar el usuario.",
        text: "Por favor, intente nuevamente. Si el problema persiste contacte a su administrador.",
        showConfirmButton: false,
        timer: 3000,
      });
    }

    return;
  };

  return (
    <MainLayout>
      <div className="w-full h-full">
        <h1 className="text-center p-[10px] font-bold text-[36px]">
          Editar Usuario
        </h1>
        <div className="w-[50%] mx-auto flex flex-col gap-[10px]">
          <input
            type="text"
            placeholder="Nombre de Usuario"
            value={user.nombre_usuario}
            required
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            onChange={(event) => {
              setUser({ ...user, nombre_usuario: event.target.value });
            }}
          />
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={newEmail}
            required
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            onChange={(event) => {
              setNewEmail(event.target.value);
            }}
          />
          <select
            value={user.rol_id}
            required
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            onChange={(event) => {
              setUser({ ...user, rol_id: event.target.value });
            }}
          >
            <option value="0" disabled>
              Seleccione Rol
            </option>
            {roleList.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          <input
            type="password"
            placeholder="Contraseña Actual (Dejar vacío para no cambiar)"
            value={oldPassword}
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            onChange={(event) => {
              setOldPassword(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Nueva contraseña (Dejar vacío para no cambiar)"
            value={newPassword}
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            className="p-[10px] text-[16px] rounded-[4px] border border-[#ddd] outline-none"
            value={confirmNewPassword}
            onChange={(event) => {
              setConfirmedNewPassword(event.target.value);
            }}
          />
          <button
            className="p-[10px] text-[16px] bg-[#007bff] text-white rounded-[4px] disabled:cursor-not-allowed"
            onClick={() => editUser()}
            disabled={isEditing}
          >
            {isEditing ? (
                <AiOutlineLoading3Quarters className="animate-spin w-5 h-5" />
              ) : (
                "Guardar Cambios"
              )}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditarUsuario;
