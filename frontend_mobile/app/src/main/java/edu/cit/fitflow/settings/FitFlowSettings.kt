package edu.cit.fitflow.settings

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import com.bumptech.glide.Glide
import edu.cit.fitflow.FitFlowDashboard
import edu.cit.fitflow.goalPlan.MyGoals
import edu.cit.fitflow.user.ProfileData
import edu.cit.fitflow.R
import edu.cit.fitflow.login.Login

class FitFlowSettings : AppCompatActivity() {

    @SuppressLint("SetTextI18n")
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_settings)
        
        // Retrieve user data from SharedPreferences
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        val firstName = sharedPreferences.getString("firstName", "Unknown")
        val lastName = sharedPreferences.getString("lastName", "Unknown")
        val email = sharedPreferences.getString("email", "Unknown")

        Log.d("Settings", "First Name: $firstName, Last Name: $lastName, Email: $email")

        // Display the user data in the Settings page
        val userNameTextView = findViewById<TextView>(R.id.user_name)
        val userEmailTextView = findViewById<TextView>(R.id.user_email)

        userNameTextView.text = "$firstName $lastName"
        userEmailTextView.text = email

        val toProfileData = findViewById<ConstraintLayout>(R.id.toProfileData)
        val toMyGoals = findViewById<ConstraintLayout>(R.id.toMyGoals)
        val arrowRightProfile = findViewById<ImageView>(R.id.arrowRightProfile)
        val arrowRightGoals = findViewById<ImageView>(R.id.arrowRightGoals)

        val toDashboard = findViewById<ImageView>(R.id.backtoSettings2)
        toDashboard.setOnClickListener {
            val intent = Intent(this, FitFlowDashboard::class.java)
            startActivity(intent)
        }

        // To Profile Data Page
        toProfileData.setOnClickListener {
            val intent = Intent(this, ProfileData::class.java)
            startActivity(intent)
        }
        arrowRightProfile.setOnClickListener {
            val intent = Intent(this, ProfileData::class.java)
            startActivity(intent)
        }

        // To My Goals Page
        toMyGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)
        }
        arrowRightGoals.setOnClickListener {
            val intent = Intent(this, MyGoals::class.java)
            startActivity(intent)
        }

        // Logout functionality
        val logoutButton = findViewById<TextView>(R.id.txtLogout)
        logoutButton.setOnClickListener {
            val dialog = AlertDialog.Builder(this)
                .setTitle("Logout")
                .setMessage("Are you sure you want to logout?")
                .setPositiveButton("Yes") { _, _ ->
                    logoutUser()
                }
                .setNegativeButton("Cancel", null)
                .create()
            dialog.show()
        }

        val profilePicturePath = sharedPreferences.getString("profilePicturePath", null)
        val profileImageView = findViewById<ImageView>(R.id.profile_image) // your ID in Settings layout

        Glide.with(this)
            .load(profilePicturePath?.let { "http://10.0.2.2:8080/$it" } ?: R.drawable.default_profile_picture)
            .circleCrop()
            .into(profileImageView)

    }

    private fun logoutUser() {
        val prefs = getSharedPreferences("prefs", MODE_PRIVATE).edit()
        prefs.clear()
        prefs.apply()

        Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show()

        val intent = Intent(this, Login::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

}