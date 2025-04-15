import React from "react";
import Footer from "../Footer";

const PrivacySettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Privacy Policy</h1>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-sm text-gray-700 space-y-4 max-h-[500px] overflow-y-auto">
          <p>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>

          <p>
            <strong>1. Information We Collect:</strong> We collect personal details (e.g., name, email), health-related data you input, and usage data like device type and interaction history.
          </p>

          <p>
            <strong>2. How We Use Data:</strong> Your information helps us personalize workouts, nutrition, and feature recommendations. We may also use anonymized data for improving our services.
          </p>

          <p>
            <strong>3. Sharing of Data:</strong> We do not sell your data. We may share it with trusted partners (e.g., analytics providers) under strict confidentiality agreements.
          </p>

          <p>
            <strong>4. Security:</strong> We use industry-standard encryption and secure servers to protect your personal data.
          </p>

          <p>
            <strong>5. Your Rights:</strong> You can request to view, modify, or delete your personal information at any time through your account settings.
          </p>

          <p>
            <strong>6. Cookies:</strong> We may use cookies for a smoother experience. You can control cookie settings in your browser.
          </p>

          <p>
            <strong>7. Policy Updates:</strong> This privacy policy may be updated occasionally. You will be notified of major changes.
          </p>

          <p>
            If you have any questions about our privacy practices, feel free to contact our support team through the Help Center.
          </p>
        </div>

        <div className="mt-4 text-[12px] text-gray-600">
          We respect your data and your trust. Thanks for being part of our community!
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacySettings;
