import React, { useState } from "react";
import { Zap, LocateFixed, ShieldCheck, Dumbbell, Crown, Navigation2,  } from "lucide-react";
import Footer from "../Footer";

const plans = [
  {
    name: "Basic",
    price: "₱249/month",
    color: "blue",
    description: "Perfect for beginners starting their fitness journey",
    features: [
      "Calorie tracking basics",
      "5 workout templates",
      "Basic progress charts",
      "Water intake reminders",
      "1 device access",
      "Community forum access"
    ],
    icon: <Navigation2 className="h-7 w-7 mb-2 mt-2 ml-2 mr-2" />
  },
  {
    name: "Pro",
    price: "₱499/month",
    color: "purple",
    description: "For serious fitness enthusiasts looking to level up",
    features: [
      "Everything in Basic",
      "Detailed nutrition tracking",
      "Protein & macro calculator",
      "Unlimited workout templates",
      "Advanced progress analytics",
      "Goal-specific workout plans",
      "Priority support",
      "3 device access",
      "Achievement badges"
    ],
    icon: <LocateFixed className="h-7 w-7 mb-2 mt-2 ml-2 mr-2" />
  },
  {
    name: "Elite",
    price: "₱749/month",
    color: "orange",
    description: "The ultimate fitness experience",
    features: [
      "Everything in Pro",
      "AI workout recommendations",
      "Custom meal planning",
      "Body measurement tracking",
      "Premium badges collection",
      "Advanced health metrics",
      "Fitness community challenges",
      "Video form analysis",
      "24/7 coach support",
      "Unlimited device access"
    ],
    icon: <Crown className="h-7 w-7 mb-2 mt-2 ml-2 mr-2" />
  }
];

const SubscriptionPlanSettings = () => {
  const [hoveredPlan, setHoveredPlan] = useState(null);

  const getGradientClass = (planColor, isHovered) => {
    const baseClasses = "border rounded-2xl shadow-sm p-6 flex flex-col justify-between transition-all duration-300";
    
    if (!isHovered) {
      return `${baseClasses} bg-white border-gray-200`;
    }
    
    switch (planColor) {
      case "blue":
        return `${baseClasses} bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 transform -translate-y-2`;
      case "purple":
        return `${baseClasses} bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300 transform -translate-y-2`;
      case "orange":
        return `${baseClasses} bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 transform -translate-y-2`;
      default:
        return `${baseClasses} bg-white border-gray-200`;
    }
  };

  const getButtonClass = (planColor, isHovered) => {
    const baseClasses = "mt-6 text-white py-3 rounded-xl text-sm font-medium transition-all duration-300";
    
    switch (planColor) {
      case "blue":
        return `${baseClasses} ${isHovered ? "bg-blue-600 shadow-lg" : "bg-blue-500"}`;
      case "purple":
        return `${baseClasses} ${isHovered ? "bg-purple-600 shadow-lg" : "bg-purple-500"}`;
      case "orange":
        return `${baseClasses} ${isHovered ? "bg-orange-600 shadow-lg" : "bg-orange-500"}`;
      default:
        return `${baseClasses} ${isHovered ? "bg-gray-800" : "bg-gray-700"}`;
    }
  };

  const getBadgeClass = (planColor) => {
    switch (planColor) {
      case "blue":
        return "bg-blue-100 text-blue-800";
      case "purple":
        return "bg-purple-100 text-purple-800";
      case "orange":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-8 w-full max-w-6xl mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-3 mt-4 ml-4">Subscription Plan</h1>
        <p className="text-gray-600 mb-7 ml-4 text-[13px]">Unlock your fitness potential with the perfect subscription for your goals</p>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={getGradientClass(plan.color, hoveredPlan === plan.name)}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              <div>
                <div className={`inline-flex items-center justify-center rounded-full p-2 ${getBadgeClass(plan.color)}`}>
                  {plan.icon}
                </div>
                <h2 className="text-xl font-bold mt-2 mb-1">{plan.name}</h2>
                <p className="text-gray-800 font-bold text-2xl mb-2">{plan.price}</p>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="h-px w-full bg-gray-200 mb-4"></div>
                <ul className="text-sm text-gray-600 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Zap className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                className={getButtonClass(plan.color, hoveredPlan === plan.name)}
              >
                <div classname= "font-bold">
                Choose {plan.name}
                </div>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <h3 className="font-semibold text-[18px]">Satisfaction Guaranteed</h3>
              <p className="text-gray-600 text-[14px]">Try FitFlow risk-free with our 14-day money back guarantee</p>
            </div>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition">
            Learn More
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubscriptionPlanSettings;