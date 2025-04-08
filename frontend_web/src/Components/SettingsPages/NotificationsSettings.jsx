import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Footer from "../Footer";

const NotificationItem = ({ label, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-xl transition"
  >
    <span className="text-base font-medium">{label}</span>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </div>
);

const NotificationsSettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Notifications</h1>

        <div className="bg-white border border-gray-120 rounded-2xl overflow-hidden shadow-sm text-[13px]">
          <NotificationItem label="Push notifications" onClick={() => console.log("Push")} />
          <hr className="border-gray-120" />
          <NotificationItem label="Email notifications" onClick={() => console.log("Email")} />
        </div>
      </div>

      <Footer />
    </div>
  );
};


export default NotificationsSettings;
