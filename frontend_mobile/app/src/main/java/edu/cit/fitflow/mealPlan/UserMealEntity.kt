package edu.cit.fitflow.mealPlan

data class UserMealEntity(
    val id: Int,
    val userId: Int,
    val name: String,   // <- match backend
    val time: String,   // <- match backend
    val calories: Int,
    val protein: Int,
    val carbs: Int,
    val fats: Int,
    val notes: String?,
    val ingredients: String?,
    val image: String,
    val totalCalories: Double,
    val dateAdded: Long
)


