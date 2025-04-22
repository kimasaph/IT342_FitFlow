package edu.cit.fitflow

data class UserMealDTO(
    val userId: Int,
    val name: String,
    val time: String,
    val calories: Int,
    val protein: Int,
    val carbs: Int,
    val fats: Int,
    val notes: String,
    val ingredients: String,
    val image: String // You can use a URL or base64-encoded string depending on how you handle images
)
