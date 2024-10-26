import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MainLayout } from "../components/Layout/MainLayout";
import { CiEdit } from "react-icons/ci";
import { MdDisabledByDefault } from "react-icons/md";
import { Search } from "lucide-react";

const User = () => {
  const BaseAPiUrl = process.env.REACT_APP_API_BASE_URL;
  const [searchText, setSearchText] = useState("");
  const [userList, setUserList] = useState([]);
  const [filteredUserList, setFilteredUserList] = useState([]);
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
        setFilteredUserList(formattedUserList);
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

  //Para filtros..
  useEffect(() => {
    let filtered = userList;

    if(searchText != ""){
      const search = searchText.toLowerCase();
      filtered = filtered.filter(user =>
        user.nombre_usuario?.trim().toLowerCase().includes(search) ||
        user.correo_electronico?.trim().toLowerCase().includes(search) ||
        user.role?.trim().toLowerCase().includes(search)
      )
    }

    setFilteredUserList(filtered);
  }, [searchText]);

  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center">
        <h1 className="w-full text-center my-10 font-bold text-[36px]">
          Gestión de Usuarios
        </h1>
        <div className="w-[80%] flex justify-between items-center mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="w-[300px] rounded-lg py-2 pl-10 border border-gray-300 outline-none"
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"/>
          </div>
          <Link
            to="/crear_usuario"
            className="bg-[#007bff] text-white rounded-[4px] py-2 px-4 text-[14px]"
          >
            Registrar Usuario
          </Link>
        </div>
        <table className="w-[80%] border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="p-[10px] border border-[#ddd] rounded-l-lg bg-[#ADD8E6]">
                ID
              </th>
              <th className="p-[10px] border-r border-[#ddd] bg-[#ADD8E6]">
                Nombre de Usuario
              </th>
              <th className="p-[10px] border-r border-[#ddd] bg-[#ADD8E6]">
                Correo Electrónico
              </th>
              <th className="p-[10px] border-r border-[#ddd] bg-[#ADD8E6]">
                Rol
              </th>
              <th className="p-[10px] bg-[#ADD8E6]"></th>
              <th className="p-[10px] rounded-r-lg bg-[#ADD8E6]"></th>
            </tr>
          </thead>
          <tbody>
            {filteredUserList.map((usuario) => (
              <tr
                key={usuario.id}
                className="hover:bg-[#E2DAD6] bg-[#F5EDED] hover:cursor-pointer"
              >
                <td className="p-[10px] border-r border-[#ddd]  rounded-l-lg">
                  {usuario.id}
                </td>
                <td className="p-[10px] border-r border-[#ddd] text-center">
                  {usuario.nombre_usuario}
                </td>
                <td className="p-[10px] border-r border-[#ddd] text-center">
                  {usuario.correo_electronico}
                </td>
                <td className="p-[10px] border-r border-[#ddd] text-center">
                  {usuario.role}
                </td>
                <td className="p-[10px] border-r border-[#ddd]">
                  <div className="w-full flex justify-center items-center">
                    <CiEdit
                      className="w-8 h-8 text-[#007bff]"
                      onClick={() => naviagte(`/editar_usuario/${usuario.id}`)}
                    />
                  </div>
                </td>
                <td className="p-[10px] rounded-r-lg">
                  <div className="w-full flex justify-center items-center">
                    <MdDisabledByDefault
                      className="w-8 h-8 text-[#ff6347]"
                      onClick={() => toggleUserEdit(usuario)}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {filteredUserList.length == 0 && (
              <p>No se encontraron datos...</p>
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default User;
