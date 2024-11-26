import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaSearch, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import AddPermissionModal from "../Modal/AddModal/AddPermissionModal";
import EditPermissionModal from "../Modal/EditModal/EditPermissionModal";
import { permissions as importedPermissions } from "../Api/MockDatas";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Permissions = () => {
  const headings = [
    { key: "id", value: "ID" },
    { key: "permission", value: "Permission" },
    { key: "description", value: "Description" },
    { key: "action", value: "Actions" },
  ];

  const [permissions, setPermissions] = useState(importedPermissions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPermissionData, setEditPermissionData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.permission
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      permission.description
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

    const matchesPermissionFilter =
      permissionFilter === "" || permission.permission === permissionFilter;

    return matchesSearch && matchesPermissionFilter;
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPermissions = filteredPermissions.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const paginatedUsers = sortedPermissions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(sortedPermissions.length / rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRowDetail = (event, id) => {
    const rows = [...selectedRows];
    if (rows.includes(id)) {
      setSelectedRows(rows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...rows, id]);
    }
  };

  const selectAllCheckbox = (event) => {
    const newSelectedRows = [];
    if (event.target.checked) {
      permissions.forEach((permission) => {
        newSelectedRows.push(permission.id);
      });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (permissionId) => {
    const permissionToEdit = permissions.find(
      (permission) => permission.id === permissionId
    );
    if (permissionToEdit) {
      setEditPermissionData(permissionToEdit);
      setIsModalOpen(true);
    }
  };

  const handleAddPermission = (newPermission) => {
    setPermissions((prevPermissions) => [
      ...prevPermissions,
      { id: Date.now(), ...newPermission },
    ]);
    toast("Permission added successfully!", {
      position: "top-right",
    });
  };

  const handleDelete = (permissionId) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete permission with ID ${permissionId}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setPermissions(
          permissions.filter((permission) => permission.id !== permissionId)
        );
        toast(`Permission with ID ${permissionId} deleted successfully`, {
          position: "top-right",
        });
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      toast.error("No permissions selected for deletion", {
        position: "top-right",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedRows.length} permission(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setPermissions(
          permissions.filter(
            (permission) => !selectedRows.includes(permission.id)
          )
        );
        toast(`${selectedRows.length} permission(s) deleted successfully`, {
          position: "top-right",
        });
        setSelectedRows([]);
      }
    });
  };

  const handleSaveEdit = (updatedPermission) => {
    setPermissions((prevPermission) =>
      prevPermission.map((permission) =>
        permission.id === updatedPermission.id ? updatedPermission : permission
      )
    );
  };

  const uniquePermissions = Array.from(
    new Set(permissions.map((permission) => permission.permission))
  );

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Navbar />
      <ToastContainer />
      <div className="bg-[#e7e7f0] rounded-lg shadow-md mt-6 p-6 sm:p-8">
        <div className="container mx-auto">
          <h1 className="mb-4 text-2xl font-bold sm:text-3xl">
            Permission Table
          </h1>
          <div className="flex flex-col mb-4 space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <div className="flex flex-col items-start w-full sm:flex-row sm:space-x-4 sm:w-auto sm:items-center">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  className="w-full p-2 pl-10 transition duration-300 ease-in-out border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute text-gray-500 transition duration-200 ease-in-out transform -translate-y-1/2 left-4 top-1/2" />
              </div>
              <div className="relative w-full mt-3 sm:w-56 md:mt-0">
                <select
                  className="w-full p-2 pl-3 transition duration-300 ease-in-out border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={permissionFilter}
                  onChange={(e) => setPermissionFilter(e.target.value)}
                >
                  <option value="">All Permissions</option>
                  {uniquePermissions.map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <AddPermissionModal onAddPermission={handleAddPermission} />
              <button
                className="flex items-center gap-2 px-2 py-1 text-white transition-colors duration-300 bg-red-600 rounded-lg hover:bg-red-700"
                onClick={handleBulkDelete}
              >
                <FaTrash className="" />
                Delete Selected
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow">
            <table className="w-full text-sm text-left text-gray-900 table-auto">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="rowCheckbox"
                      onChange={selectAllCheckbox}
                    />
                  </th>
                  {headings.map((heading) => (
                    <th
                      key={heading.key}
                      className="px-6 py-3 font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort(heading.key)}
                    >
                      {heading.value}
                      {sortConfig.key === heading.key &&
                        (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((permission, index) => (
                  <tr
                    key={permission.id}
                    className="border-b border-gray-300 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rowCheckbox"
                        checked={selectedRows.includes(permission.id)}
                        onChange={(event) => getRowDetail(event, permission.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4">{permission.permission}</td>
                    <td className="px-6 py-4">{permission.description}</td>
                    <td className="flex items-center gap-5 px-6 py-4">
                      <button
                        className="text-[#003049] hover:text-blue-800 transition-colors duration-300"
                        onClick={() => handleEdit(permission.id)}
                      >
                        <FaEdit size={23} />
                      </button>
                      <button
                        className="text-red-600 transition-colors duration-300 hover:text-red-800"
                        onClick={() => handleDelete(permission.id)}
                      >
                        <FaTrash size={23} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <EditPermissionModal
              permissionData={editPermissionData}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSave={(updatedData) => {
                handleSaveEdit(updatedData);
                setIsModalOpen(false);
              }}
            />
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-lg ${
                    i + 1 === currentPage
                      ? "bg-[#003049] text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-700 hover:text-white transition-colors duration-300`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;
