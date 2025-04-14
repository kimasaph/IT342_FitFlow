import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ClipboardList, Settings, Menu, X } from "lucide-react";

export default function TrainerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "TRAINER") {
      navigate("/"); // Redirect non-trainer users to the home page
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className={`flex items-center ${isSidebarOpen ? "justify-start" : "justify-center w-full"}`}>
            <ClipboardList className="h-8 w-8 text-blue-600" />
            {isSidebarOpen && <span className="ml-2 text-xl font-bold">Trainer</span>}
          </div>
          <button onClick={toggleSidebar} className={`${isSidebarOpen ? "block" : "hidden"}`}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 py-4">
          <nav className="px-2">
            <NavItem icon={Users} label="Clients" isSidebarOpen={isSidebarOpen} />
            <NavItem icon={ClipboardList} label="Workout Plans" isSidebarOpen={isSidebarOpen} />
            <NavItem icon={Settings} label="Settings" isSidebarOpen={isSidebarOpen} />
          </nav>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold">Welcome, Trainer!</h2>
            <p className="text-gray-600 mt-2">
              This is your dashboard. Here you can manage your clients, create workout plans, and more.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, isSidebarOpen }) {
  return (
    <a
      href="#"
      className={`flex items-center py-2 px-4 rounded-lg mb-1 ${
        isSidebarOpen ? "justify-start" : "justify-center"
      } text-gray-600 hover:bg-gray-100`}
    >
      <Icon className="h-5 w-5 text-gray-500" />
      {isSidebarOpen && <span className="ml-3">{label}</span>}
    </a>
  );
}
