package edu.cit.fitflow.mealPlan

import android.app.AlertDialog
import android.app.Dialog
import android.os.Bundle
import android.view.View
import android.view.Window
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import com.google.android.material.button.MaterialButton
import edu.cit.fitflow.R
import edu.cit.fitflow.services.ApiService
import edu.cit.fitflow.services.RetrofitClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.*

class MealPlanActivity : AppCompatActivity() {

    private lateinit var apiService: ApiService
    private var userId: Int = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_meal_plan)

        apiService = RetrofitClient.instance
        val sharedPreferences = getSharedPreferences("prefs", MODE_PRIVATE)
        userId = sharedPreferences.getInt("userId", -1)

        findViewById<CardView>(R.id.add_new_meal_button).setOnClickListener {
            showAddMealDialog()
        }

        val currentDateTextView = findViewById<TextView>(R.id.tv_current_date)
        val today = SimpleDateFormat("EEE, MMM dd", Locale.getDefault()).format(Date())
        currentDateTextView.text = today

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

        dialog.findViewById<MaterialButton>(R.id.cancel_button).setOnClickListener { dialog.dismiss() }

        dialog.findViewById<MaterialButton>(R.id.add_meal_button).setOnClickListener {
            val newMeal = UserMealDTO(
                userId,
                dialog.findViewById<EditText>(R.id.meal_name_input).text.toString(),
                dialog.findViewById<EditText>(R.id.meal_time_input).text.toString(),
                dialog.findViewById<EditText>(R.id.calories_input).text.toString().toInt(),
                dialog.findViewById<EditText>(R.id.protein_input).text.toString().toInt(),
                dialog.findViewById<EditText>(R.id.carbs_input).text.toString().toInt(),
                dialog.findViewById<EditText>(R.id.fats_input).text.toString().toInt(),
                dialog.findViewById<EditText>(R.id.meal_description_input).text.toString(),
                dialog.findViewById<EditText>(R.id.meal_ingredients_input).text.toString(),
                "image_url_here"
            )
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

    private fun updateMeal(mealId: Int, updatedMeal: UserMealDTO) {
        val token = "Bearer ${getSharedPreferences("prefs", MODE_PRIVATE).getString("auth_token", "")}"
        apiService.updateMeal(mealId, updatedMeal, token).enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@MealPlanActivity, "Meal updated successfully", Toast.LENGTH_SHORT).show()
                    fetchMeals(userId)
                } else {
                    Toast.makeText(this@MealPlanActivity, "Failed to update meal", Toast.LENGTH_SHORT).show()
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

    private fun fetchMeals(userId: Int) {
        val token = "Bearer ${getSharedPreferences("prefs", MODE_PRIVATE).getString("auth_token", "")}"
        apiService.getMealsByUserId(userId, token).enqueue(object : Callback<List<UserMealEntity>> {
            override fun onResponse(call: Call<List<UserMealEntity>>, response: Response<List<UserMealEntity>>) {
                if (response.isSuccessful) {
                    val meals = response.body() ?: return
                    val mealContainer = findViewById<LinearLayout>(R.id.meal_list_container)
                    val proteinView = findViewById<TextView>(R.id.tv_total_protein)
                    val fatView = findViewById<TextView>(R.id.tv_total_fat)
                    val carbsView = findViewById<TextView>(R.id.tv_total_carbs)

                    var totalProtein = 0
                    var totalFat = 0
                    var totalCarbs = 0

                    mealContainer.removeAllViews()
                    meals.forEach { meal ->
                        totalProtein += meal.protein
                        totalFat += meal.fats
                        totalCarbs += meal.carbs

                        val mealCard = createMealCard(meal)
                        mealContainer.addView(mealCard)
                    }

                    proteinView.text = totalProtein.toString()
                    fatView.text = totalFat.toString()
                    carbsView.text = totalCarbs.toString()
                }
            }

            override fun onFailure(call: Call<List<UserMealEntity>>, t: Throwable) {
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
                .setPositiveButton("Yes") { _, _ -> deleteMeal(meal.id) }
                .setNegativeButton("Cancel", null)
                .create()
            dialog.show()
        }

        cardView.setOnClickListener {
            showMealDetailsDialog(meal)
        }

        return cardView
    }

    private fun showMealDetailsDialog(meal: UserMealEntity) {
        val dialog = Dialog(this)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setContentView(R.layout.dialog_meal_details)
        dialog.setCancelable(true)

        val title = dialog.findViewById<TextView>(R.id.tv_meal_title)
        val time = dialog.findViewById<TextView>(R.id.tv_meal_time)
        val macros = dialog.findViewById<TextView>(R.id.tv_meal_macros)
        val ingredients = dialog.findViewById<TextView>(R.id.tv_meal_ingredients)
        val notes = dialog.findViewById<TextView>(R.id.tv_meal_notes)
        val closeBtn = dialog.findViewById<Button>(R.id.btn_close)
        //val editBtn = dialog.findViewById<Button>(R.id.btn_edit)

        title.text = meal.name
        time.text = meal.time
        macros.text = "${meal.calories} kcal | ${meal.protein}g protein | ${meal.carbs}g carbs | ${meal.fats}g fat"
        ingredients.text = "Ingredients: ${meal.ingredients}"
        notes.text = "Notes: ${meal.notes}"

        closeBtn.setOnClickListener { dialog.dismiss() }

//        editBtn.setOnClickListener {
//            dialog.dismiss()
//            showEditMealDialog(meal)
//        }

        dialog.show()
    }

    private fun showEditMealDialog(meal: UserMealEntity) {
        val dialog = Dialog(this)
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setContentView(R.layout.dialog_add_meal)
        dialog.setCancelable(true)

        val categoryDropdown = dialog.findViewById<AutoCompleteTextView>(R.id.meal_time_input)
        val adapter = ArrayAdapter(this, android.R.layout.simple_dropdown_item_1line, arrayOf("Breakfast", "2nd Breakfast", "Lunch", "Dinner", "Snack"))
        categoryDropdown.setAdapter(adapter)

        dialog.findViewById<EditText>(R.id.meal_name_input).setText(meal.name)
        dialog.findViewById<EditText>(R.id.meal_time_input).setText(meal.time)
        dialog.findViewById<EditText>(R.id.calories_input).setText(meal.calories.toString())
        dialog.findViewById<EditText>(R.id.protein_input).setText(meal.protein.toString())
        dialog.findViewById<EditText>(R.id.carbs_input).setText(meal.carbs.toString())
        dialog.findViewById<EditText>(R.id.fats_input).setText(meal.fats.toString())
        dialog.findViewById<EditText>(R.id.meal_description_input).setText(meal.notes ?: "")
        dialog.findViewById<EditText>(R.id.meal_ingredients_input).setText(meal.ingredients ?: "")

        dialog.findViewById<MaterialButton>(R.id.cancel_button).setOnClickListener { dialog.dismiss() }

        val updateButton = dialog.findViewById<MaterialButton>(R.id.add_meal_button)
        updateButton.text = "Update Meal"

        updateButton.setOnClickListener {
            val updatedMeal = UserMealDTO(
                userId = meal.userId,
                name = dialog.findViewById<EditText>(R.id.meal_name_input).text.toString(),
                time = dialog.findViewById<EditText>(R.id.meal_time_input).text.toString(),
                calories = dialog.findViewById<EditText>(R.id.calories_input).text.toString().toInt(),
                protein = dialog.findViewById<EditText>(R.id.protein_input).text.toString().toInt(),
                carbs = dialog.findViewById<EditText>(R.id.carbs_input).text.toString().toInt(),
                fats = dialog.findViewById<EditText>(R.id.fats_input).text.toString().toInt(),
                notes = dialog.findViewById<EditText>(R.id.meal_description_input).text.toString(),
                ingredients = dialog.findViewById<EditText>(R.id.meal_ingredients_input).text.toString(),
                image = meal.image
            )
            updateMeal(meal.id, updatedMeal)
            dialog.dismiss()
        }

        dialog.show()
    }
}
