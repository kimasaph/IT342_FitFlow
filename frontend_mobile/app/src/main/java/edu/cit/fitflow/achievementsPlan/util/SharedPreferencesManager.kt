package edu.cit.fitflow.achievementsPlan.util

import android.content.Context
import android.content.SharedPreferences

class SharedPreferencesManager(context: Context) {

    private val prefs: SharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)

    companion object {
        private const val PREF_NAME = "FitFlowPrefs"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USERNAME = "username"
        private const val KEY_EMAIL = "email"
        private const val KEY_AUTH_TOKEN = "auth_token"
    }

    fun saveUserData(userId: Int, username: String, email: String, authToken: String) {
        prefs.edit()
            .putInt(KEY_USER_ID, userId)
            .putString(KEY_USERNAME, username)
            .putString(KEY_EMAIL, email)
            .putString(KEY_AUTH_TOKEN, authToken)
            .apply()
    }

    fun getUserId(): Int {
        return prefs.getInt(KEY_USER_ID, 1) // Default to 1 for demo purposes
    }

    fun getUsername(): String? {
        return prefs.getString(KEY_USERNAME, null)
    }

    fun getEmail(): String? {
        return prefs.getString(KEY_EMAIL, null)
    }

    fun getAuthToken(): String? {
        return prefs.getString(KEY_AUTH_TOKEN, null)
    }

    fun clearUserData() {
        prefs.edit().clear().apply()
    }
}