package edu.cit.fitflow.services

import edu.cit.fitflow.login.LoginRequest
import edu.cit.fitflow.SendCodeRequest
import edu.cit.fitflow.user.User
import edu.cit.fitflow.mealPlan.UserMealDTO
import edu.cit.fitflow.mealPlan.UserMealEntity
import edu.cit.fitflow.user.UserResponse
import edu.cit.fitflow.VerificationResponse
import edu.cit.fitflow.VerifyCodeRequest
import edu.cit.fitflow.achievementsPlan.dto.AchievementProgressResponse
import edu.cit.fitflow.achievementsPlan.dto.UserAchievementDTO
import edu.cit.fitflow.workoutPlan.ActiveWorkout
import edu.cit.fitflow.workoutPlan.WorkoutRequest
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.*

interface ApiService {

    //User Management endpoints
    @POST("/api/auth/signup")
    fun registerUser(@Body user: User): Call<ResponseBody>

    @POST("/api/auth/signup-setup")
    fun setupUserProfile(@Body profileData: Map<String, String>): Call<ResponseBody>

    @POST("/api/auth/login")
    fun loginUser(@Body loginRequest: LoginRequest): Call<UserResponse>

    @POST("/api/verification/send-code")
    fun sendVerificationCode(@Body request: SendCodeRequest): Call<VerificationResponse>

    @POST("/api/verification/verify-code")
    fun verifyCode(@Body request: VerifyCodeRequest): Call<VerificationResponse>

    @POST("/api/auth/google")
    fun socialLogin(@Body request: Map<String, String>): Call<ResponseBody>

    @POST("auth/facebook")
    fun facebookLogin(@Body request: Map<String, String>): Call<ResponseBody>

    @GET("/api/auth/profile/{userId}")
    fun getUserProfile(@Path("userId") userId: Int, @Header("Authorization") token: String): Call<User>

    @PUT("/api/auth/update-profile/{userId}")
    fun updateUserProfile(@Path("userId") userId: Int, @Body updatedUser: User, @Header("Authorization") token: String): Call<ResponseBody>


    //Workouts endpoints
    @POST("/api/workouts/{userId}")
    fun createWorkout(
        @Path("userId") userId: Int,
        @Body workout: WorkoutRequest
    ): Call<WorkoutRequest>

    @GET("/api/workouts/user/{userId}")
    fun getWorkoutHistory(@Path("userId") userId: Int): Call<List<ActiveWorkout>>

//    @POST("/api/workouts/{userId}")
//    fun createWorkout(@Path("userId") userId: Int, @Body workout: WorkoutRequest): Call<WorkoutRequest>


    // Meal Plan
    @POST("/api/meals")
    fun createMeal(@Body newMeal: UserMealDTO): Call<ResponseBody>

    @GET("/api/meals/user/{userId}")
    fun getMealsByUserId(@Path("userId") userId: Int, @Header("Authorization") token: String): Call<List<UserMealEntity>>

    @DELETE("/api/meals/{mealId}")
    fun deleteMeal(@Path("mealId") mealId: Int, @Header("Authorization") token: String): Call<ResponseBody>

    @PUT("/api/meal/{id}")
    fun updateMeal(
        @Path("id") mealId: Int,
        @Body updatedMeal: UserMealDTO,
        @Header("Authorization") token: String
    ): Call<ResponseBody>


    // Achievement endpoints
    @GET("/api/achievements/my")
    fun getMyAchievements(@Query("userId") userId: Int): Call<List<UserAchievementDTO>>

    @GET("/api/achievements/my-progress")
    fun getMyAchievementsWithProgress(@Query("userId") userId: Int): Call<AchievementProgressResponse>

    @GET("/api/achievements/progress")
    fun getAchievementProgress(@Query("userId") userId: Int): Call<Map<String, Int>>

    @POST("/api/achievements/progress/update")
    fun updateAchievementProgress(
        @Query("userId") userId: Int,
        @Query("triggerEvent") triggerEvent: String,
        @Query("progress") progress: Int = 1
    ): Call<ResponseBody>
}
