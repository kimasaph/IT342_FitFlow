package edu.cit.fitflow

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.Window
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.google.android.material.button.MaterialButton
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MealPlanActivity : AppCompatActivity() {

    private lateinit var apiService: ApiService
    private var userId: Int = 0 // Get the userId from SharedPreferences or intent

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_meal_plan)

        // Initialize Retrofit instance
        apiService = RetrofitClient.instance

        // Retrieve userId from SharedPreferences
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        userId = sharedPreferences.getInt("userId", -1)

        // Set up Add New Meal button
        val addNewMealButton = findViewById<CardView>(R.id.add_new_meal_button)
        addNewMealButton.setOnClickListener {
            showAddMealDialog()
        }

        // Fetch and display existing meals
        fetchMeals(userId)
    }

    private fun showAddMealDialog() {
        val dialog = Dialog(this)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setContentView(R.layout.dialog_add_meal)
        dialog.setCancelable(true)

        val mealCategories = arrayOf("Breakfast", "2nd Breakfast", "Lunch", "Dinner", "Snack")
        val categoryDropdown = dialog.findViewById<AutoCompleteTextView>(R.id.meal_time_input)
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, mealCategories)
        categoryDropdown.setAdapter(adapter)

        val cancelButton = dialog.findViewById<MaterialButton>(R.id.cancel_button)
        cancelButton.setOnClickListener { dialog.dismiss() }

        val addMealButton = dialog.findViewById<MaterialButton>(R.id.add_meal_button)
        addMealButton.setOnClickListener {
            val mealName = dialog.findViewById<EditText>(R.id.meal_name_input).text.toString()
            val mealTime = dialog.findViewById<EditText>(R.id.meal_time_input).text.toString()
            val calories = dialog.findViewById<EditText>(R.id.calories_input).text.toString().toInt()
            val protein = dialog.findViewById<EditText>(R.id.protein_input).text.toString().toInt()
            val carbs = dialog.findViewById<EditText>(R.id.carbs_input).text.toString().toInt()
            val fats = dialog.findViewById<EditText>(R.id.fats_input).text.toString().toInt()
            val notes = dialog.findViewById<EditText>(R.id.meal_description_input).text.toString()
            val ingredients = dialog.findViewById<EditText>(R.id.meal_ingredients_input).text.toString()
            val image = "image_url_here"

            val newMeal = UserMealDTO(userId, mealName, mealTime, calories, protein, carbs, fats, notes, ingredients, image)
            addMeal(newMeal)
            dialog.dismiss()
        }

        dialog.show()
    }

    private fun addMeal(newMeal: UserMealDTO) {
        apiService.createMeal(newMeal).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@MealPlanActivity, "Meal added successfully", Toast.LENGTH_SHORT).show()
                    fetchMeals(userId)
                } else {
                    Toast.makeText(this@MealPlanActivity, "Failed to add meal", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(this@MealPlanActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun deleteMeal(mealId: Int) {
        val token = "Bearer ${getSharedPreferences("prefs", MODE_PRIVATE).getString("auth_token", "")}"
        apiService.deleteMeal(mealId, token).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@MealPlanActivity, "Meal deleted successfully", Toast.LENGTH_SHORT).show()
                    fetchMeals(userId)
                } else {
                    Toast.makeText(this@MealPlanActivity, "Failed to delete meal", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(this@MealPlanActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }



    private fun createMealCard(meal: UserMealEntity): View {
        val cardView = layoutInflater.inflate(R.layout.item_meal_card, null)

        val mealType = cardView.findViewById<TextView>(R.id.meal_type)
        val mealName = cardView.findViewById<TextView>(R.id.meal_name)
        val mealDetails = cardView.findViewById<TextView>(R.id.meal_details)
        val btnDelete = cardView.findViewById<ImageView>(R.id.btn_delete_meal)

        mealType.text = meal.time
        mealName.text = meal.name
        mealDetails.text = "${meal.calories} kcal | ${meal.protein}g | ${meal.carbs}g | ${meal.fats}g of fat"

        btnDelete.setOnClickListener {
            val dialog = AlertDialog.Builder(this)
                .setTitle("Delete Meal")
                .setMessage("Are you sure you want to delete \"${meal.name}\"?")
                .setPositiveButton("Yes") { _, _ ->
                    deleteMeal(meal.id)


                }
                .setNegativeButton("Cancel", null)
                .create()
            dialog.show()
        }

        return cardView
    }


    private fun fetchMeals(userId: Int) {
        val token = "Bearer ${getSharedPreferences("prefs", MODE_PRIVATE).getString("auth_token", "")}"
        if (token.isNotEmpty()) {
            apiService.getMealsByUserId(userId, token).enqueue(object : Callback<List<UserMealEntity>> {
                override fun onResponse(call: Call<List<UserMealEntity>>, response: Response<List<UserMealEntity>>) {
                    if (response.isSuccessful) {
                        val meals = response.body() ?: return
                        val mealContainer = findViewById<LinearLayout>(R.id.meal_list_container)
                        mealContainer.removeAllViews()
                        meals.forEach { meal ->
                            val mealCard = createMealCard(meal)
                            mealContainer.addView(mealCard)
                        }
                    }
                }

                override fun onFailure(call: Call<List<UserMealEntity>>, t: Throwable) {
                    Toast.makeText(this@MealPlanActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
    }

    private fun showAddDrinkDialog() {
        // Optional: Future feature
    }
}
