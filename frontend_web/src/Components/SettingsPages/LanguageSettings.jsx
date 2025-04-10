import React, { useState } from "react";
import Footer from "../Footer";

const LanguageSettings = () => {
  const [language, setLanguage] = useState("en");

  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "ph", label: "Filipino" },
    { code: "jp", label: "Japanese" },
  ];

  const handleSave = () => {
    console.log(`Language set to: ${language}`);
    // You could also save this to localStorage or call an API
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Language</h1>

        <div className="bg-white border border-gray-120 rounded-2xl shadow-sm px-4 py-5 space-y-6">
          <div>
            <label className="text-base font-medium block mb-2">
              Preferred language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className= "text-right">
          <button
            onClick={handleSave}
            className="bg-[#3797EF] text-white text-sm py-2 px-4 rounded-xl hover:bg-[#318ce7] transition mr-5"
          >
            Save Language
          </button>
          </div>
        </div>

        <div className="mt-4 text-[13px] text-gray-600 space-y-2">
          <p>
            Select your preferred language for the app. This will change the
            language used in menus, buttons, and interface text.
          </p>
          <p>
            Some content may still appear in the original language if a
            translation is not available.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LanguageSettings;
