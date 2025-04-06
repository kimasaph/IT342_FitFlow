import React from "react";
import Footer from "../Footer";

const plans = [
  {
    name: "Basic",
    price: "$5/month",
    features: ["Access to core features", "Basic support", "1 device"],
  },
  {
    name: "Standard",
    price: "$10/month",
    features: ["Everything in Basic", "Priority support", "3 devices"],
  },
  {
    name: "Premium",
    price: "$15/month",
    features: ["All features unlocked", "24/7 support", "Unlimited devices"],
  },
];

const SubscriptionPlanSettings = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-[800px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Subscription Plans</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h2 className="text-lg font-semibold mb-2">{plan.name}</h2>
                <p className="text-gray-800 font-bold text-xl mb-4">{plan.price}</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <button className="mt-6 bg-black text-white py-2 rounded-xl text-sm hover:bg-gray-800 transition">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubscriptionPlanSettings;
