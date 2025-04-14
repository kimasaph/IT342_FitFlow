package edu.cit.fitflow

import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {

    @POST("auth/signupuser")
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




}
