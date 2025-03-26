package edu.cit.fitflow

import android.net.Uri
import android.os.Bundle
import android.widget.MediaController
import android.widget.VideoView

import androidx.appcompat.app.AppCompatActivity

class Login : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val videoView = findViewById<VideoView>(R.id.vidGetStarted1)
        // Direct URL of the video
        val uri = Uri.parse("android.resource://$packageName/${R.raw.get_started}")
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