import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import { Toaster, toast } from "react-hot-toast";

const BodyMetricsSettings = () => {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isHeightFocused, setIsHeightFocused] = useState(false);
  const [isWeightFocused, setIsWeightFocused] = useState(false);
  const [isAgeFocused, setIsAgeFocused] = useState(false);

  useEffect(() => {
    document.title = "Body Metrics";
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setHeight(parsedUser.height ? parsedUser.height.toString() : "");
        setWeight(parsedUser.weight ? parsedUser.weight.toString() : "");
        setAge(parsedUser.age ? parsedUser.age.toString() : "");

        setInitialValues({
          height: parsedUser.height ? parsedUser.height.toString() : "",
          weight: parsedUser.weight ? parsedUser.weight.toString() : "",
          age: parsedUser.age ? parsedUser.age.toString() : "",
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
        setError("Failed to load your profile data.");
        toast.error("Failed to load profile data");
      }
    }

    setIsInitialLoading(false);
  }, []);

  useEffect(() => {
    const hasChanged =
      height !== initialValues.height ||
      weight !== initialValues.weight ||
      age !== initialValues.age;

    setIsModified(hasChanged);
  }, [height, weight, age, initialValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) {
        throw new Error("No authentication token or user data found");
      }

      const userData = JSON.parse(storedUser);

      const requestBody = {
        ...userData,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        age: age ? parseInt(age) : null,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile?userId=${userData.userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || "Failed to update profile";
        } catch (e) {
          errorMessage = errorText || "Failed to update profile";
        }
        throw new Error(errorMessage);
      }

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setInitialValues({
        height: updatedUser.height ? updatedUser.height.toString() : "",
        weight: updatedUser.weight ? updatedUser.weight.toString() : "",
        age: updatedUser.age ? updatedUser.age.toString() : "",
      });

      setIsModified(false);
      toast.success("Body metrics updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#D4EDDA", color: "#155724" } }}
      />
      <div className="p-8 w-full max-w-[680px] mx-auto flex-grow">
        <h1 className="text-xl font-bold mb-6 mt-4">Body Profile</h1>

        {isInitialLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading your profile data...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Height */}
            <div>
              <label className="block text-[15px] font-bold mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                onFocus={() => setIsHeightFocused(true)}
                onBlur={() => setIsHeightFocused(false)}
                placeholder="e.g., 170"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-gray-400 ${
                  !isHeightFocused && height === initialValues.height
                    ? "text-gray-400"
                    : "text-black"
                }`}
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-[15px] font-bold mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                onFocus={() => setIsWeightFocused(true)}
                onBlur={() => setIsWeightFocused(false)}
                placeholder="e.g., 65"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-gray-400 ${
                  !isWeightFocused && weight === initialValues.weight
                    ? "text-gray-400"
                    : "text-black"
                }`}
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-[15px] font-bold mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onFocus={() => setIsAgeFocused(true)}
                onBlur={() => setIsAgeFocused(false)}
                placeholder="e.g., 21"
                className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-gray-400 ${
                  !isAgeFocused && age === initialValues.age
                    ? "text-gray-400"
                    : "text-black"
                }`}
              />
            </div>

            <div className="mt-6 text-[12px] text-gray-600">
              This information helps us personalize your fitness journey. It
              would be part of your public profile.
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={!isModified || isSubmitting}
                className={`transition px-16 py-3 rounded-xl text-sm font-semibold ${
                  isModified && !isSubmitting
                    ? "bg-[#3797EF] text-white hover:bg-[#318ce7] cursor-pointer"
                    : "bg-[#3797EF]/30 text-white cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BodyMetricsSettings;
