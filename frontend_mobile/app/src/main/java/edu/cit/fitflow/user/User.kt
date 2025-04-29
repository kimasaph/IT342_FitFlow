// User.kt
package edu.cit.fitflow.user

data class User(
    val userId: Int,
    val username: String,
    val email: String,
    val phoneNumber: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val gender: String,
    val height: Float,
    val weight: Float,
    val age: Int,
    val bodyGoal: String,
    val profilePicturePath: String? = null   // <-- ADD THIS
)
