import React from "react";
import { ChevronRight } from "lucide-react";
import Footer from "../Footer";
import { useNavigate } from "react-router-dom";

const HelpItem = ({ label, onClick }) => (
  <div
    onClick={onClick}
    className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer rounded-xl transition"
  >
    <span className="text-base font-medium">{label}</span>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </div>
);

const HelpSettings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Help Center</h1>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm text-[13px]">
          <HelpItem label="FAQs" onClick={() => navigate("/help/faqs")} />
          <hr className="border-gray-100" />
          <HelpItem label="Account Issues" onClick={() => navigate("/help/account")} />
          <hr className="border-gray-100" />
          <HelpItem label="Report a Bug" onClick={() => navigate("/help/report")} />
          <hr className="border-gray-100" />
          <HelpItem label="Feedback & Suggestions" onClick={() => navigate("/help/feedback")} />
          <hr className="border-gray-100" />
          <HelpItem label="Contact Support" onClick={() => navigate("/help/contact")} />
        </div>

        <div className="mt-6 text-[12px] text-gray-600 leading-relaxed">
          If you need help with your account, experience issues with features, or have general inquiries, feel free to reach out. We're here to help you make the most of your fitness journey.
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpSettings;
