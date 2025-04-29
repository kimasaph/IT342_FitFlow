package edu.cit.fitflow.workoutPlan.yogaWorkout

import androidx.lifecycle.ViewModel

class YogaWorkoutViewModel : ViewModel() {
    // Workout state
    var difficulty: String = "beginner"
        private set

    var elapsedTime: Int = 0
    var breathCount: Int = 0
    var completedWorkouts: Int = 0

    // Pose data
    private val poses = listOf(
        // Beginner poses
        YogaPose(
            id = "beginner_1",
            name = "Mountain Pose (Tadasana)",
            description = "Stand tall with feet together, shoulders relaxed, weight evenly distributed through your feet, arms at sides.",
            benefits = "Improves posture, strengthens thighs, ankles, and core",
            duration = 30,
            difficulty = "beginner"
        ),
        YogaPose(
            id = "beginner_2",
            name = "Child's Pose (Balasana)",
            description = "Kneel on the floor, touch big toes together, sit on heels, then bend forward laying torso between thighs and arms extended.",
            benefits = "Gently stretches hips, thighs, and ankles; calms the mind and relieves stress",
            duration = 30,
            difficulty = "beginner"
        ),
        YogaPose(
            id = "beginner_3",
            name = "Downward-Facing Dog (Adho Mukha Svanasana)",
            description = "Start on hands and knees, lift knees off floor, straighten legs, and press heels toward floor forming an inverted V shape.",
            benefits = "Strengthens arms and legs; stretches shoulders, hamstrings, calves, and hands",
            duration = 30,
            difficulty = "beginner"
        ),
        YogaPose(
            id = "beginner_4",
            name = "Seated Forward Bend (Paschimottanasana)",
            description = "Sit with legs extended, inhale and lengthen spine, exhale and hinge at hips to fold forward over legs.",
            benefits = "Stretches spine, shoulders and hamstrings; calms the mind and relieves stress",
            duration = 30,
            difficulty = "beginner"
        ),
        YogaPose(
            id = "beginner_5",
            name = "Corpse Pose (Savasana)",
            description = "Lie on your back with arms at sides, palms up, and legs extended. Close eyes and breathe naturally.",
            benefits = "Relaxes the body, reduces blood pressure, anxiety, and insomnia",
            duration = 30,
            difficulty = "beginner"
        ),

        // Intermediate poses
        YogaPose(
            id = "intermediate_1",
            name = "Warrior 1 (Virabhadrasana I)",
            description = "From standing, step one foot back, turn it 45 degrees. Bend front knee over ankle, raise arms overhead, and look up.",
            benefits = "Strengthens legs, core, and arms; improves focus and stability",
            duration = 45,
            difficulty = "intermediate"
        ),
        YogaPose(
            id = "intermediate_2",
            name = "Triangle Pose (Trikonasana)",
            description = "Stand with legs wide apart, turn one foot out, extend arms, and reach down to ankle while extending other arm up.",
            benefits = "Stretches legs, hips, and spine; improves balance and digestion",
            duration = 45,
            difficulty = "intermediate"
        ),
        YogaPose(
            id = "intermediate_3",
            name = "Bridge Pose (Setu Bandha Sarvangasana)",
            description = "Lie on back, bend knees with feet flat on floor. Lift hips toward ceiling, clasping hands beneath back.",
            benefits = "Opens chest and shoulders; strengthens spine, glutes, and hamstrings",
            duration = 45,
            difficulty = "intermediate"
        ),
        YogaPose(
            id = "intermediate_4",
            name = "Seated Twist (Ardha Matsyendrasana)",
            description = "Sit with legs extended, bend one knee and cross it over the other leg. Twist torso toward bent knee.",
            benefits = "Improves spinal mobility; stimulates digestion; relieves back tension",
            duration = 45,
            difficulty = "intermediate"
        ),
        YogaPose(
            id = "intermediate_5",
            name = "Pigeon Pose (Eka Pada Rajakapotasana)",
            description = "From downward dog, bring one knee forward behind wrist, extend other leg back. Fold forward over bent leg.",
            benefits = "Opens hips and hip flexors; releases stored tension and anxiety",
            duration = 45,
            difficulty = "intermediate"
        ),

        // Advanced poses
        YogaPose(
            id = "advanced_1",
            name = "Crow Pose (Bakasana)",
            description = "Squat with hands on floor, knees resting on back of upper arms. Shift weight forward until feet lift off floor.",
            benefits = "Strengthens arms, wrists, and core; improves balance and concentration",
            duration = 60,
            difficulty = "advanced"
        ),
        YogaPose(
            id = "advanced_2",
            name = "Wheel Pose (Urdhva Dhanurasana)",
            description = "Lie on back, bend knees with feet flat. Place hands beside ears, fingers pointing toward shoulders. Press up to arch back.",
            benefits = "Strengthens arms, legs, abdomen, and spine; increases energy and counteracts depression",
            duration = 60,
            difficulty = "advanced"
        ),
        YogaPose(
            id = "advanced_3",
            name = "Headstand (Sirsasana)",
            description = "Kneel, place forearms on floor with interlaced fingers. Place crown of head on floor, straighten legs and lift them up.",
            benefits = "Improves circulation, strengthens shoulders and core; calms the mind",
            duration = 60,
            difficulty = "advanced"
        ),
        YogaPose(
            id = "advanced_4",
            name = "Side Plank (Vasisthasana)",
            description = "From plank position, shift weight to one hand, stack feet, and rotate body to side while raising top arm.",
            benefits = "Strengthens wrists, arms, and core; improves balance and focus",
            duration = 60,
            difficulty = "advanced"
        ),
        YogaPose(
            id = "advanced_5",
            name = "King Dancer Pose (Natarajasana)",
            description = "Stand on one leg, bend other knee and grasp foot behind you. Extend free arm forward, then lift leg up and back.",
            benefits = "Improves balance and concentration; stretches shoulders, chest, thighs, and ankles",
            duration = 60,
            difficulty = "advanced"
        )
    )

    // Filtered poses based on current difficulty
    var filteredPoses: List<YogaPose> = poses.filter { it.difficulty == difficulty }
        private set

    fun setDifficulty(newDifficulty: String) {
        difficulty = newDifficulty
        filteredPoses = poses.filter { it.difficulty == difficulty }
    }

    fun resetTimer() {
        elapsedTime = 0
        breathCount = 0
    }

    fun incrementCompletedWorkouts() {
        completedWorkouts++
    }
}

data class YogaPose(
    val id: String,
    val name: String,
    val description: String,
    val benefits: String,
    val duration: Int, // in seconds
    val difficulty: String // "beginner", "intermediate", or "advanced"
)