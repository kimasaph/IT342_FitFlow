package edu.cit.fitflow

data class VerifyCodeRequest(
    val email: String,
    val code: String
)
