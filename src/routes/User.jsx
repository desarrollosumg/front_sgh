import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MainLayout } from "../components/Layout/MainLayout";

const User = () => {
  const BaseAPiUrl = process.env.REACT_APP_API_BASE_URL;
  const [userList, setUserList] = useState([]);
  const naviagte = useNavigate();

  //Una vez montado el componente listamos los usuarios activos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userListResponse = await axios.get(`${BaseAPiUrl}/usuario`);
        const roleListResponse = await axios.get(`${BaseAPiUrl}/listarRol`);

        const roleList = roleListResponse.data || [];

        const formattedUserList =
          userListResponse.data?.map((user) => {
            const rol = roleList.find((rol) => rol.id === user.rol_id);
            return {
              ...user,
              role: rol.nombre || "",
            };
          }) || [];

        setUserList(formattedUserList);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      }
    };
    fetchData();
  }, []);

  //Función para editar el usuario
  const toggleUserEdit = async (user) => {
    try {
      const date = new Date();
      const dateGt = new Date(date.getTime() - 6 * 60 * 60 * 1000);
      const status = user.activo === 1 ? 0 : 1;
      const updateUser = {
        ...user,
        activo: status,
        usuario_modificacion: 1,
        fecha_modificacion: dateGt,
      };

      await axios.put(`${BaseAPiUrl}/usuario`, updateUser);
      setUserList((prev) =>
        prev.map((u) => (u.id === user.id ? updateUser : u))
      );
      await Swal.fire(
        "Éxito",
        "El estado del usuario ha sido actualizado",
        "success"
      );
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el estado del usuario:", error);
      Swal.fire(
        "Error",
        "No se pudo actualizar el estado del usuario",
        "error"
      );
    }
  };

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="w-full text-center my-10 font-bold text-[36px]">
          Gestión de Usuarios
        </h1>
        <div className="w-[80%] flex justify-end items-center mb-10">
          <Link
            to="/crear_usuario"
            className="bg-[#007bff] text-white rounded-[4px] py-2 px-4 text-[14px]"
          >
            Registrar Usuario
          </Link>
        </div>
          <table className="w-[80%] border-collapse text-center">
            <thead>
              <tr>
                <th style={styles.headerCell}>ID</th>
                <th style={styles.headerCell}>Nombre de Usuario</th>
                <th style={styles.headerCell}>Correo Electrónico</th>
                <th style={styles.headerCell}>Rol</th>
                <th style={styles.headerCell}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((usuario) => (
                <tr key={usuario.id}>
                  <td style={styles.cell}>{usuario.id}</td>
                  <td style={styles.cell}>{usuario.nombre_usuario}</td>
                  <td style={styles.cell}>{usuario.correo_electronico}</td>
                  <td style={styles.cell}>{usuario.role}</td>
                  <td style={styles.cell}>
                    <button
                      onClick={() => naviagte(`/editar_usuario/${usuario.id}`)}
                      style={styles.editButton}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleUserEdit(usuario)}
                      style={styles.toggleButton}
                    >
                      Desactivar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

      </div>
    </MainLayout>
  );
};

const styles = {
  headerCell: {
    padding: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#ADD8E6",
    color: "black",
  },
  cell: {
    padding: "10px",
    border: "1px solid #ddd",
  },
  editButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
    marginRight: "5px",
  },
  toggleButton: {
    backgroundColor: "#ff6347",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default User;