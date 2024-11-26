import React, { useState } from "react";
import { FaUsers, FaKey } from "react-icons/fa";
import { MdSecurity, MdDashboard } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: <MdDashboard />, path: "/dashboard" },
  { label: "Users", icon: <FaUsers />, path: "/users" },
  { label: "Roles", icon: <MdSecurity />, path: "/roles" },
  { label: "Permissions", icon: <FaKey />, path: "/permissions" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#003049] text-white z-40 sm:w-64 w-60 shadow-lg transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        <div className="flex justify-center w-full mb-8 border-b border-gray-700 py-7">
          <Link
            to={"/dashboard"}
            className="text-2xl font-bold tracking-wide text-white cursor-pointer"
          >
            RBAC
          </Link>
        </div>
        <ul className="flex flex-col w-full gap-4 px-4">
          {menuItems.map((menu, index) => (
            <li key={index} className="w-full">
              <Link
                to={menu.path}
                className={`flex items-center gap-4 w-full h-12 px-4 rounded-md text-left text-white/90 hover:bg-gray-800 transition-all ${
                  location.pathname === menu.path ? "bg-gray-700" : ""
                }`}
              >
                <span className="text-2xl">{menu.icon}</span>
                <span className="flex-1 text-lg">{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <button
        onClick={toggleSidebar}
        className="absolute z-50 p-2 text-white rounded-full top-7 left-4 sm:hidden"
      >
        {isSidebarOpen ? (
          <AiOutlineCloseCircle
            size={24}
            className="p-1 text-gray-900 bg-white rounded-full"
          />
        ) : (
          <CgMenuGridO
            size={24}
            className="text-gray-900 bg-white rounded-full"
          />
        )}
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
