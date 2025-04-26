// File: src/Components/Admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Menu, Search, Settings, Users, X } from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // "all", "users", "trainers"
  const [members, setMembers] = useState([]); // State to store members
  const [userStats, setUserStats] = useState({ totalUsers: 0, totalMembers: 0, totalTrainers: 0 }); // State for user stats
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Assume role is stored in localStorage
    if (userRole !== "ADMIN") {
      navigate("/"); // Redirect non-admin users to the home page
    }
  }, [navigate]);

  useEffect(() => {
    fetchMembers(); // Fetch members on component mount
  }, [activeTab]);

  useEffect(() => {
    fetchUserStats(); // Fetch user stats on component mount
  }, []);

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const role = activeTab === "trainers" ? "TRAINER" : activeTab === "users" ? "MEMBER" : null;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });
      const allUsers = response.data;

      // Filter users based on role and exclude admin account
      const filteredUsers = allUsers
        .filter((user) => user.role !== "ADMIN") // Exclude admin account
        .filter((user) => (role ? user.role === role : true)); // Filter by role or show all users except admin

      // Map users to include status, roles, and formatted date
      const mappedUsers = filteredUsers.map((user) => ({
        ...user,
        role: user.role || "Unknown", // Ensure role is displayed
        status: "Active", // Set status to Active
        joined: user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A",
      }));

      setMembers(mappedUsers);
    } catch (error) {
      console.error("Failed to fetch users:", error.response?.data || error.message);
      setMembers([]); // Ensure members state is reset in case of an error
    }
  };

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/user-stats`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      });
      setUserStats(response.data); // Update user stats state
    } catch (error) {
      console.error("Failed to fetch user stats:", error.response?.data || error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    // Clear all local storage data to restart the session
    localStorage.clear();
    navigate("/login"); // Navigate back to login page
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    fetchMembers(); // Fetch members immediately after switching tabs
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className={`flex items-center ${isSidebarOpen ? "justify-start" : "justify-center w-full"}`}>
            <img
              src="/src/assets/images/logoFitFlow.png" // Replace with the actual path to the FitFlow logo
              alt="FitFlow Logo"
              className="h-8 w-8"
            />
            {isSidebarOpen && <span className="ml-2 text-xl font-bold">FitFlow</span>}
          </div>
          <button onClick={toggleSidebar} className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 py-4">
          <nav className="px-2">
            {/* Members with sub-items */}
            <div className="mb-1">
              <NavItem icon={Users} label="Users" isActive={true} isSidebarOpen={isSidebarOpen} />

              {isSidebarOpen && (
                <div className="ml-9 mt-1 space-y-1">
                  <a
                    href="#"
                    className={`block text-sm py-1 ${
                      activeTab === "users" ? "text-purple-600 font-semibold" : "text-gray-600 hover:text-purple-600"
                    }`}
                    onClick={() => handleTabClick("users")}
                  >
                    Members
                  </a>
                  <a
                    href="#"
                    className={`block text-sm py-1 ${
                      activeTab === "trainers" ? "text-purple-600 font-semibold" : "text-gray-600 hover:text-purple-600"
                    }`}
                    onClick={() => handleTabClick("trainers")}
                  >
                    Trainers
                  </a>
                </div>
              )}
            </div>

            <NavItem icon={Settings} label="Settings" isSidebarOpen={isSidebarOpen} />
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="font-semibold text-purple-600">FF</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">FitFlow</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-4 w-full py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button onClick={toggleSidebar} className="mr-4">
                  <Menu className="h-6 w-6 text-gray-500" />
                </button>
              )}
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* User Stats Section */}
          <div className="p-6 bg-white rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-purple-100 rounded-lg text-center">
                <h3 className="text-xl font-bold text-purple-700">{userStats.totalUsers}</h3>
                <p className="text-sm text-purple-600">Total Users</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg text-center">
                <h3 className="text-xl font-bold text-blue-700">{userStats.totalMembers}</h3>
                <p className="text-sm text-blue-600">Total Members</p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg text-center">
                <h3 className="text-xl font-bold text-green-700">{userStats.totalTrainers}</h3>
                <p className="text-sm text-green-600">Total Trainers</p>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {activeTab === "all"
                    ? "All Members"
                    : activeTab === "users"
                    ? "Members"
                    : "Trainers"}
                </h2>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.role === "Trainer" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{member.joined}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Components
function NavItem({ icon: Icon, label, isActive = false, isSidebarOpen }) {
  return (
    <a
      href="#"
      className={`flex items-center py-2 px-4 rounded-lg mb-1 ${
        isActive ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:bg-gray-100"
      } ${isSidebarOpen ? "" : "justify-center"}`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "text-purple-600" : "text-gray-500"}`} />
      {isSidebarOpen && <span className="ml-3">{label}</span>}
    </a>
  );
}
