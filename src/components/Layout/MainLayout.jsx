import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";
import { FaUserMd } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";



export const MainLayout = ({ children }) => {

  const modules = [
    {

      id: 1,
      icon: <FaUserMd />,
      slug: "/user",
      name: "Usuarios"
    },
    {
      id: 2,
      icon: <IoIosExit />,
      slug: "/",
      name: "Cerrar Session"
    },
    {
      id: 3,
      slug: "/",
      name: "Cerrar Sesión"
    }
  ];

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-16 h-full rounded-r-[10px] bg-blue-300">
        {modules.map(module => (
          <Link
            key={module.id}
            to={module.slug}
          >
            <div
              className="w-full flex justify-center items-center py-3"
              data-tooltip-id={`module_${module.id}`}
              data-tooltip-content={module.name}
            >
              {module.icon}
            </div>
            <Tooltip id={`module_${module.id}`}/>
          </Link>
        ))}
      </div>
      <div className="w-[calc(100vw-4rem)] h-full">
        {children}
      </div>
    </div>
  );
};
