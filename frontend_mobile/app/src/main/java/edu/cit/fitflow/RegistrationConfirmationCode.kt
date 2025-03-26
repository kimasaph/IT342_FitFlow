package edu.cit.fitflow

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.MediaController
import android.widget.VideoView
import androidx.appcompat.app.AppCompatActivity

class RegistrationConfirmationCode : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.registration_confirmation_code)


        val btnConfirm = findViewById<Button>(R.id.btnContinue)

        btnConfirm.setOnClickListener{
            val intent = Intent(this, RegistrationForm::class.java)
            startActivity(intent)
        }

        val v1 = findViewById<ImageView>(R.id.imgLeft)

        v1.setOnClickListener{
            val intent = Intent(this,Registration::class.java)
            startActivity(intent)
        }

        val videoView = findViewById<VideoView>(R.id.vidConfirmCode)
        // Direct URL of the video
        val uri = Uri.parse("android.resource://$packageName/${R.raw.confirm_code}")
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
