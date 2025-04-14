// File: src/Components/Admin/AdminDashboard.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Activity, Menu, Search, Settings, Users, X } from "lucide-react"

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("all") // "all", "users", "trainers"
  const navigate = useNavigate()

  useEffect(() => {
    const userRole = localStorage.getItem("role") // Assume role is stored in localStorage
    if (userRole !== "ADMIN") {
      navigate("/") // Redirect non-admin users to the home page
    }
  }, [navigate])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <div className={`flex items-center ${isSidebarOpen ? "justify-start" : "justify-center w-full"}`}>
            <Activity className="h-8 w-8 text-purple-600" />
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
              <NavItem icon={Users} label="Members" isActive={true} isSidebarOpen={isSidebarOpen} />

              {isSidebarOpen && (
                <div className="ml-9 mt-1 space-y-1">
                  <a
                    href="#"
                    className="block text-sm text-gray-600 hover:text-purple-600 py-1"
                    onClick={() => setActiveTab("users")}
                  >
                    Users
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-gray-600 hover:text-purple-600 py-1"
                    onClick={() => setActiveTab("trainers")}
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
              <span className="font-semibold text-purple-600">JD</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            )}
          </div>
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
              <h1 className="text-xl font-semibold">Dashboard</h1>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              icon={<Users className="h-8 w-8 text-purple-600" />}
              title="Total Members"
              value="2,543"
              change="+12.5%"
              isPositive={true}
            />
            <StatCard
              icon={<Users className="h-8 w-8 text-blue-600" />}
              title="Users"
              value="2,507"
              change="+12.8%"
              isPositive={true}
            />
            <StatCard
              icon={<Users className="h-8 w-8 text-green-600" />}
              title="Trainers"
              value="36"
              change="+5.2%"
              isPositive={true}
            />
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {activeTab === "all" ? "All Members" : activeTab === "users" ? "Users" : "Trainers"}
                </h2>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      activeTab === "all" ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("all")}
                  >
                    All
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      activeTab === "users" ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    Users
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      activeTab === "trainers" ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("trainers")}
                  >
                    Trainers
                  </button>
                </div>
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
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    {
                      name: "Emma Wilson",
                      email: "emma.w@example.com",
                      role: "User",
                      joined: "May 15, 2023",
                      status: "Active",
                    },
                    {
                      name: "Michael Brown",
                      email: "michael.b@example.com",
                      role: "User",
                      joined: "May 14, 2023",
                      status: "Active",
                    },
                    {
                      name: "Sophia Davis",
                      email: "sophia.d@example.com",
                      role: "Trainer",
                      joined: "May 13, 2023",
                      status: "Active",
                    },
                    {
                      name: "James Miller",
                      email: "james.m@example.com",
                      role: "User",
                      joined: "May 12, 2023",
                      status: "Active",
                    },
                    {
                      name: "Olivia Johnson",
                      email: "olivia.j@example.com",
                      role: "Trainer",
                      joined: "May 11, 2023",
                      status: "Active",
                    },
                  ]
                    .filter((member) => {
                      if (activeTab === "all") return true
                      if (activeTab === "users") return member.role === "User"
                      if (activeTab === "trainers") return member.role === "Trainer"
                      return true
                    })
                    .map((member, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="font-semibold text-purple-600">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
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
                                : member.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-purple-600 hover:text-purple-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{" "}
                  <span className="font-medium">42</span> results
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
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
  )
}

function StatCard({ icon, title, value, change, isPositive }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="rounded-full p-2 bg-purple-50">{icon}</div>
      </div>
      <div className="flex items-center">
        <span className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</span>
        <span className="text-xs text-gray-500 ml-1">from last month</span>
      </div>
    </div>
  )
}
