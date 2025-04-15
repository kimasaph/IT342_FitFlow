package edu.cit.fitflow

import android.content.ClipData.Item
import android.content.Intent
import android.media.Image
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.internal.NavigationMenu
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class FitFlowDashboard : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_fit_flow_dashboard)




        val addWorkout = findViewById<Button>(R.id.btnAddWorkout)
        addWorkout.setOnClickListener{
            val intent = Intent(this, WorkoutPlanActivity::class.java)
            startActivity(intent)
        }

        //To Settings
        val toSettings = findViewById<ImageView>(R.id.img_settings)
        toSettings.setOnClickListener{
            val intent = Intent(this, Settings::class.java)
            startActivity(intent)
        }

        val currentDateText: TextView = findViewById(R.id.current_date)
        val currentTimeText: TextView = findViewById(R.id.current_time)

        // Set current date
        val dateFormat = SimpleDateFormat("EEE, MMM d, yyyy", Locale.getDefault())
        val currentDate = dateFormat.format(Date())
        currentDateText.text = currentDate

        // Set current time
        val timeFormat = SimpleDateFormat("h:mm a", Locale.getDefault())
        var currentTime = timeFormat.format(Date())
        currentTimeText.text = currentTime

        // To update time every minute
        val handler = Handler(Looper.getMainLooper())
        val updateTimeRunnable = object : Runnable {
            override fun run() {
                val updatedTime = timeFormat.format(Date())
                currentTimeText.text = updatedTime
                handler.postDelayed(this, 60000) // Update every minute
            }
        }
        handler.postDelayed(updateTimeRunnable, 60000)


    }
}