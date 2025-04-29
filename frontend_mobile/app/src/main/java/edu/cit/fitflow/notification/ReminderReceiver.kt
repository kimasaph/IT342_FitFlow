package edu.cit.fitflow.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val helper = NotificationHelper(context)
        helper.sendNotification("Workout Reminder", "Don't forget to complete your workout today!")
    }
}
