import React, { useState } from "react";
import { Plus, X, Check, ChevronRight } from "lucide-react";

const drinkOptions = [
  {
    name: "Water",
    calories: 0,
    image: "water.png",
  },
  {
    name: "Green Tea",
    calories: 2,
    image: "green-tea.png",
  },
  {
    name: "Black Coffee",
    calories: 5,
    image: "coffee.png",
  },
  {
    name: "Protein Shake",
    calories: 120,
    image: "protein-shake.png",
  },
  {
    name: "Fruit Smoothie",
    calories: 180,
    image: "smoothie.png",
  },
  {
    name: "Sparkling Water",
    calories: 0,
    image: "sparkling.png",
  },
  {
    name: "Herbal Tea",
    calories: 0,
    image: "herbal-tea.png",
  },
  {
    name: "Latte",
    calories: 120,
    image: "latte.png",
  },
];

const AddDrink = ({ onAddDrink }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);

  const handleAddDrink = () => {
    if (selectedDrink && onAddDrink) {
      onAddDrink(selectedDrink);
    }
    setIsModalOpen(false);
    setSelectedDrink(null);
  };

  return (
    <>
      {/* Add Drink Button */}
      <div
        className="rounded-2xl border-2 border-dashed border-teal-600 p-5 flex flex-col items-center justify-center h-full min-h-64 bg-white cursor-pointer hover:bg-teal-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="bg-teal-100 rounded-full p-3 mb-2">
          <Plus className="text-teal-600 w-6 h-6" />
        </div>
        <p className="text-teal-600 font-medium text-center">Add drink</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Add a Drink</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Drink List */}
            <div className="overflow-y-auto flex-grow p-4 space-y-3">
              {drinkOptions.map((drink) => (
                <div
                  key={drink.name}
                  onClick={() => setSelectedDrink(drink)}
                  className={`p-3 rounded-lg border flex items-center space-x-3 cursor-pointer transition ${
                    selectedDrink?.name === drink.name
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded">
                    <img
                      src={`/images/foods/${drink.image}`}
                      alt={drink.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-800">
                        {drink.name}
                      </h3>
                      {selectedDrink?.name === drink.name && (
                        <Check size={18} className="text-teal-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {drink.calories} calories
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-between items-center bg-gray-50">
              <div className="text-sm text-gray-500">
                {selectedDrink
                  ? `Selected: ${selectedDrink.name}`
                  : "Select a drink to add"}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDrink}
                  disabled={!selectedDrink}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    selectedDrink
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <span>Add Drink</span>
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDrink;
