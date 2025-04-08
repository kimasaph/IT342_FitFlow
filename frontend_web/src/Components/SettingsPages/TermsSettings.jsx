import React from "react";
import Footer from "../Footer";

const TermsSettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Terms of Service</h1>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-sm text-gray-700 space-y-4 max-h-[500px] overflow-y-auto">
          <p>
            Welcome to our app! By using our services, you agree to the following terms. Please read them carefully.
          </p>

          <p>
            <strong>1. Use of Service:</strong> You must be at least 13 years old to use this service. You agree to use the platform for lawful purposes only.
          </p>

          <p>
            <strong>2. Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
          </p>

          <p>
            <strong>3. Intellectual Property:</strong> All content provided by this app is owned by us or our partners. You may not reproduce or distribute any materials without permission.
          </p>

          <p>
            <strong>4. Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or disrupt the experience of other users.
          </p>

          <p>
            <strong>5. Modifications:</strong> We may update these terms periodically. Continued use after changes implies acceptance of the updated terms.
          </p>

          <p>
            For full details, please visit our official website or contact support.
          </p>
        </div>

        <div className="mt-4 text-[12px] text-gray-600">
          These terms are meant to protect both you and us. If you have questions, don’t hesitate to reach out via the Help Center.
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsSettings;
