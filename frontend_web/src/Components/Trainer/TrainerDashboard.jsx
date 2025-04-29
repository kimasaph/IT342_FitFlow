import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Menu, Search, Settings, Users, X } from "lucide-react";
import axios from "axios"; // Import axios for API calls

export default function TrainerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("clients"); // "clients", "workouts"
  const [clients, setClients] = useState([]); // State to store clients
  const [trainerStats, setTrainerStats] = useState({ totalClients: 0, totalWorkouts: 0 }); // State for trainer stats
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // State for settings modal
  const [trainerDetails, setTrainerDetails] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
  }); // State for trainer details
  const [workouts, setWorkouts] = useState([]); // State to store workouts
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "TRAINER") {
      navigate("/"); // Redirect non-trainer users to the home page
    }
  }, [navigate]);

  useEffect(() => {
    fetchClients(); // Fetch clients on component mount
  }, [activeTab]);

  useEffect(() => {
    fetchTrainerStats(); // Fetch trainer stats on component mount
  }, []);

  useEffect(() => {
    fetchTrainerDetails(); // Fetch trainer details on component mount
  }, []);

  useEffect(() => {
    if (activeTab === "settings") {
      fetchTrainerDetails(); // Fetch trainer details when switching to the settings tab
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "workouts") {
      fetchWorkouts(); // Fetch workouts when switching to the workouts tab
    }
  }, [activeTab]);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainer/clients`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Failed to fetch clients:", error.response?.data || error.message);
      setClients([]);
    }
  };

  const fetchTrainerStats = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainer/stats`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      setTrainerStats(response.data);
    } catch (error) {
      console.error("Failed to fetch trainer stats:", error.response?.data || error.message);
    }
  };

  const fetchTrainerDetails = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const userId = localStorage.getItem("userId");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      setTrainerDetails(response.data); // Update trainer details state
    } catch (error) {
      console.error("Failed to fetch trainer details:", error.response?.data || error.message);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/trainer/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error("Failed to fetch workouts:", error.response?.data || error.message);
      setWorkouts([]);
    }
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const userId = localStorage.getItem("userId");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/trainer/update-profile?trainerId=${userId}`,
        trainerDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        }
      );
      alert("Profile updated successfully!");
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error.response?.data || error.message);
      alert("Failed to update profile.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "clients" || tab === "workouts") {
      fetchClients(); // Fetch clients immediately after switching tabs
    }
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
            <NavItem
              icon={Users}
              label="Clients"
              isActive={activeTab === "clients"}
              isSidebarOpen={isSidebarOpen}
              onClick={() => handleTabClick("clients")}
            />
            <NavItem
              icon={Activity}
              label="Workout Plans"
              isActive={activeTab === "workouts"}
              isSidebarOpen={isSidebarOpen}
              onClick={() => handleTabClick("workouts")}
            />
            <NavItem
              icon={Settings}
              label="Settings"
              isActive={activeTab === "settings"}
              isSidebarOpen={isSidebarOpen}
              onClick={() => handleTabClick("settings")} // Open settings tab
            />
          </nav>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="font-semibold text-blue-600">T</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Trainer</p>
                <p className="text-xs text-gray-500">Dashboard</p>
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
              <h1 className="text-xl font-semibold">Trainer Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeTab === "clients" && (
            <>
              {/* Trainer Stats Section */}
              <div className="p-6 bg-white rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold mb-4">Trainer Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-100 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-blue-700">{trainerStats.totalClients}</h3>
                    <p className="text-sm text-blue-600">Total Clients</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-lg text-center">
                    <h3 className="text-xl font-bold text-green-700">{trainerStats.totalWorkouts}</h3>
                    <p className="text-sm text-green-600">Total Workouts</p>
                  </div>
                </div>
              </div>

              {/* Clients Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      {activeTab === "clients" ? "Clients" : "Workout Plans"}
                    </h2>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clients.map((client, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{client.joined}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "workouts" && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Workout Plans</h2>
              {workouts.length > 0 ? (
                <ul className="space-y-4">
                  {workouts.map((workout, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <h3 className="text-md font-bold">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No workout plans available.</p>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
              <form onSubmit={handleSettingsSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    value={trainerDetails.firstName}
                    onChange={(e) => setTrainerDetails({ ...trainerDetails, firstName: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    value={trainerDetails.lastName}
                    onChange={(e) => setTrainerDetails({ ...trainerDetails, lastName: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={trainerDetails.age}
                    onChange={(e) => setTrainerDetails({ ...trainerDetails, age: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    value={trainerDetails.phoneNumber}
                    onChange={(e) => setTrainerDetails({ ...trainerDetails, phoneNumber: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Components
function NavItem({ icon: Icon, label, isActive = false, isSidebarOpen, onClick }) {
  return (
    <a
      href="#"
      onClick={onClick}
      className={`flex items-center py-2 px-4 rounded-lg mb-1 ${
        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
      } ${isSidebarOpen ? "" : "justify-center"}`}
    >
      <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
      {isSidebarOpen && <span className="ml-3">{label}</span>}
    </a>
  );
}
