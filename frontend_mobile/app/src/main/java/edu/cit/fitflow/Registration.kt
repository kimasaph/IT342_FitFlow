package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.MediaController
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity

class Registration : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration)


        val img1 = findViewById<ImageView>(R.id.imgLeft)

        img1.setOnClickListener{
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

        val btn1 = findViewById<Button>(R.id.btnContinue)

        btn1.setOnClickListener{
            val intent = Intent(this, RegistrationConfirmationCode::class.java)
            startActivity(intent)
        }

        val videoView = findViewById<VideoView>(R.id.vidPhoneNumber)
        // Direct URL of the video
        val uri = Uri.parse("android.resource://$packageName/${R.raw.started}")
        videoView.setVideoURI(uri)

        // Add MediaController (Play, Pause, Seek)
        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        // Start video automatically
        videoView.start()

        videoView.setOnCompletionListener {
            videoView.start() // Restart video
        }
    }
}
