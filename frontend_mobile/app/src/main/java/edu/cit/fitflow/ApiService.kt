package edu.cit.fitflow

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path

interface ApiService {

    @POST("auth/signup")
    fun registerUser(@Body user: User): Call<ResponseBody>

    @POST("auth/signup-setup")
    fun setupUserProfile(@Body profileData: Map<String, String>): Call<ResponseBody>

    @POST("auth/login")
    fun loginUser(@Body loginRequest: LoginRequest): Call<UserResponse>

    @POST("verification/send-code")
    fun sendVerificationCode(@Body request: SendCodeRequest): Call<VerificationResponse>

    @POST("verification/verify-code")
    fun verifyCode(@Body request: VerifyCodeRequest): Call<VerificationResponse>

    @POST("auth/google")
    fun socialLogin(@Body request: Map<String, String>): Call<ResponseBody>

    @POST("auth/facebook")
    fun facebookLogin(@Body request: Map<String, String>): Call<ResponseBody>

    @POST("workouts")
    fun createWorkout(@Body workout: WorkoutRequest): Call<WorkoutRequest>

    @GET("auth/profile/{userId}")
    fun getUserProfile(@Path("userId") userId: Int, @Header("Authorization") token: String): Call<User>

    @PUT("auth/update-profile/{userId}")
    fun updateUserProfile(@Path("userId") userId: Int, @Body updatedUser: User, token: String): Call<ResponseBody>


    //Meal Plan
    @POST("meals")
    fun createMeal(@Body newMeal: UserMealDTO): Call<ResponseBody>

    // Get Meals by User ID
    @GET("meals/user/{userId}")
    fun getMealsByUserId(
        @Path("userId") userId: Int,
        @Header("Authorization") token: String
    ): Call<List<UserMealEntity>>

    @DELETE("meals/{mealId}")
    fun deleteMeal(
        @Path("mealId") mealId: Int,
        @Header("Authorization") token: String
    ): Call<ResponseBody>

    @POST("workouts/{userId}")
    fun createWorkout(
        @Path("userId") userId: Int,
        @Body workout: WorkoutRequest
    ): Call<WorkoutRequest>








}
