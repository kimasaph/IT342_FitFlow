import React from "react";
import Footer from "../Footer";

const ContactsSettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Contact Us</h1>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-sm text-gray-700 space-y-4 max-h-[500px] overflow-y-auto">
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hi, feel free to reach out.
          </p>

          <p>
            <strong>Email Support:</strong><br />
            For general inquiries and technical issues, contact us at:<br />
            <a href="mailto:support@fitflowapp.com" className="text-blue-600 hover:underline">
              support@fitflowapp.com
            </a>
          </p>

          <p>
            <strong>Business Inquiries:</strong><br />
            For partnerships or collaborations, reach us at:<br />
            <a href="mailto:partners@fitflowapp.com" className="text-blue-600 hover:underline">
              partners@fitflowapp.com
            </a>
          </p>

          <p>
            <strong>Social Media:</strong><br />
            Stay updated and connect with us on:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                Instagram:{" "}
                <a
                  href="https://instagram.com/fitflowapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  @fitflowapp
                </a>
              </li>
              <li>
                Facebook:{" "}
                <a
                  href="https://facebook.com/fitflowapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  /fitflowapp
                </a>
              </li>
            </ul>
          </p>

          <p>
            <strong>Help Center:</strong><br />
            For FAQs and troubleshooting, visit our Help Center available in the app settings or via our website.
          </p>
        </div>

        <div className="mt-4 text-[12px] text-gray-600">
          We're here to support your fitness journey—one message at a time.
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactsSettings;
