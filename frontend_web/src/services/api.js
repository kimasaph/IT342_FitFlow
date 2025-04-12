import axios from 'axios';

const API_BASE_URL = '/api';

// Diet Plan API
export const dietPlanApi = {
  getAllDietPlans: () => axios.get(`${API_BASE_URL}/diet-plans`),
  getDietPlanById: (id) => axios.get(`${API_BASE_URL}/diet-plans/${id}`),
  getDietPlansByUserId: (userId) => axios.get(`${API_BASE_URL}/diet-plans/user/${userId}`),
  createDietPlan: (dietPlan) => axios.post(`${API_BASE_URL}/diet-plans`, dietPlan),
  updateDietPlan: (id, dietPlan) => axios.put(`${API_BASE_URL}/diet-plans/${id}`, dietPlan),
  deleteDietPlan: (id) => axios.delete(`${API_BASE_URL}/diet-plans/${id}`),
  getCaloriePrograms: () => axios.get(`${API_BASE_URL}/diet-plans/calorie-programs`),
};

// Meal API
export const mealApi = {
  getAllMeals: () => axios.get(`${API_BASE_URL}/meals`),
  getMealById: (id) => axios.get(`${API_BASE_URL}/meals/${id}`),
  getMealsByDietPlanId: (dietPlanId) => axios.get(`${API_BASE_URL}/meals/diet-plan/${dietPlanId}`),
  createMeal: (dietPlanId, meal) => axios.post(`${API_BASE_URL}/meals/diet-plan/${dietPlanId}`, meal),
  updateMeal: (id, meal) => axios.put(`${API_BASE_URL}/meals/${id}`, meal),
  deleteMeal: (id) => axios.delete(`${API_BASE_URL}/meals/${id}`),
};