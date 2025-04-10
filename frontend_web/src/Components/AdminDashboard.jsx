import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  const fetchUsersAndTrainers = async () => {
    try {
      const userResponse = await fetch("http://localhost:8080/api/user/all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const trainerResponse = await fetch("http://localhost:8080/api/user/all-trainers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!userResponse.ok || !trainerResponse.ok) {
        throw new Error("Failed to fetch users with role USER or trainers");
      }

      const userData = await userResponse.json();
      const trainerData = await trainerResponse.json();

      console.log("Users (role USER) API Response:", userData); // Debugging log
      console.log("Trainers API Response:", trainerData); // Debugging log

      // Filter users to ensure only those with role USER are included
      setUsers(Array.isArray(userData) ? userData.filter(user => user.role === "USER") : []);
      setTrainers(Array.isArray(trainerData) ? trainerData : []);
    } catch (error) {
      console.error("Error fetching users with role USER or trainers:", error);
      setUsers([]);
      setTrainers([]);
    }
  };

  const handleDelete = async (id, isTrainer) => {
    const endpoint = isTrainer
      ? `http://localhost:8080/api/user/delete-trainer/${id}`
      : `http://localhost:8080/api/user/delete-user/${id}`;

    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await fetch(endpoint, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchUsersAndTrainers();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  const handleEdit = (id, isTrainer) => {
    alert(`Edit functionality for ${isTrainer ? "trainer" : "user"} ID: ${id} is not implemented yet.`);
  };

  const handleCreate = () => {
    alert("Create functionality is not implemented yet.");
  };

  useEffect(() => {
    fetchUsersAndTrainers();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-blue-600 text-white py-4 px-6">
        <h1 className="text-2xl font-bold align-center">Admin Dashboard</h1>
      </div>
      <div className="container mx-auto p-6">
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleCreate}
          >
            Create New User/Trainer
          </button>
        </div>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => handleEdit(user.id, false)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.id, false)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="text-xl font-semibold mt-6 mb-2">Trainers</h2>
        <table className="table-auto w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer) => (
              <tr key={trainer.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">{trainer.id}</td>
                <td className="px-4 py-2">{trainer.firstName} {trainer.lastName}</td>
                <td className="px-4 py-2">{trainer.email}</td>
                <td className="px-4 py-2">{trainer.role}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    onClick={() => handleEdit(trainer.id, true)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(trainer.id, true)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;