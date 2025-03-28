# 1. Login API

## Endpoint Name
**User Authentication**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/auth/login`

## Description
Authenticates a user and returns a JWT token for authorized access to the application.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

## Response Example
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": "12345",
    "name": "Derrick Estopace"
  }
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Successful login           | User authenticated successfully   |
| 400 Bad Request | Invalid input format  | Malformed request payload         |
| 401 Unauthorized | Incorrect credentials | Email or password is incorrect    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 100 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 2. Signup API

## Endpoint Name
**User Registration**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/auth/signup`

## Description
Registers a new user in the FitFlow application.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "name": "Derrick Estopace",
  "email": "user@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

## Response Example
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "userId": "12345",
    "email": "user@example.com"
  }
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 201 Created | User successfully created | Registration successful            |
| 400 Bad Request | Invalid input or email already exists | Validation error or duplicate email |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 50 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 3. Password Recovery API

## Endpoint Name
**Password Reset Request**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/auth/forgot-password`

## Description
Sends a password reset link to the user's email address.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "email": "user@example.com"
}
```

## Response Example
```json
{
  "status": "success",
  "message": "Password reset email sent successfully"
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Reset email sent successfully | Password reset email dispatched    |
| 400 Bad Request | Invalid email format     | Email format is incorrect         |
| 404 Not Found | Email not registered      | No account associated with email  |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 20 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 4. Reset Password API

## Endpoint Name
**Password Reset Confirmation**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/auth/reset-password`

## Description
Resets the user's password using a valid reset token.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "token": "reset-token-received-via-email",
  "newPassword": "newSecurePassword456",
  "confirmPassword": "newSecurePassword456"
}
```

## Response Example
```json
{
  "status": "success",
  "message": "Password has been reset successfully"
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Password reset successful  | User's password has been updated  |
| 400 Bad Request | Invalid input or passwords don't match | Validation error                 |
| 401 Unauthorized | Invalid or expired token | Token is invalid or expired       |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 10 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 5. Get User Settings API

## Endpoint Name
**Retrieve User Settings**

## HTTP Method
**GET**

## URL
`https://fitflow-api.com/api/user/settings`

## Description
Retrieves the current settings for the authenticated user.

## Request Headers
| Header         | Value             | Description                        |
|---------------|------------------|------------------------------------|
| Authorization | Bearer <jwt_token> | Required for authentication       |
| Content-Type  | application/json  | Specifies request body format     |

## Response Example
```json
{
  "status": "success",
  "data": {
    "email": "user@example.com",
    "firstName": "Derrick",
    "lastName": "Estopace",
    "country": "Korea",
    "city": "Seoul",
    "zip": "01000",
    "street": "123 Myeongdong St",
    "weightKg": 75,
    "trainingIntensity": "High",
    "bodyTypeGoal": "Muscular",
    "profilePictureUrl": "https://fitflow.com/images/profiles/user12345.jpg"
  }
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Settings retrieved successfully | User settings successfully returned |
| 401 Unauthorized | Invalid or missing token | Authentication failure             |
| 404 Not Found | User not found            | No user associated with request    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Authentication
- **Required**: Yes.
- **Method**: Bearer token in the `Authorization` header.

## Rate Limiting
- **Limit**: 200 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 6. Update User Settings API

## Endpoint Name
**Update User Settings**

## HTTP Method
**PUT**

## URL
`https://fitflow-api.com/api/user/settings`

## Description
Updates the settings for the authenticated user.

## Request Headers
| Header         | Value             | Description                        |
|---------------|------------------|------------------------------------|
| Authorization | Bearer <jwt_token> | Required for authentication       |
| Content-Type  | application/json  | Specifies request body format     |

## Request Body
```json
{
  "email": "user@example.com",
  "firstName": "Derrick",
  "lastName": "Estopace",
  "country": "Korea",
  "city": "Seoul",
  "zip": "01000",
  "street": "123 Myeongdong St",
  "weightKg": 80,
  "trainingIntensity": "Medium",
  "bodyTypeGoal": "Lean"
}
```

## Authentication
- **Required**: Yes.
- **Method**: Bearer token in the `Authorization` header.

## Rate Limiting
- **Limit**: 100 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 7. Tracking & Analytics API

## Endpoint Name
**User Activity Tracking**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/tracking/activity`

## Description
Logs user activities such as workouts, steps, and calories burned.

## Request Headers
| Header         | Value             | Description                        |
|---------------|------------------|------------------------------------|
| Authorization | Bearer <jwt_token> | Required for authentication       |
| Content-Type  | application/json  | Specifies request body format     |

## Request Body
```json
{
  "userId": "12345",
  "activityType": "Running",
  "durationMinutes": 30,
  "caloriesBurned": 250,
  "distanceKm": 5.2,
  "heartRateAvg": 140
}
```

## Response Example
```json
{
  "status": "success",
  "message": "Activity logged successfully"
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 201 Created | Activity logged successfully | Activity saved to tracking database |
| 400 Bad Request | Invalid input format     | Malformed request payload         |
| 401 Unauthorized | Invalid or missing token | Authentication failure            |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 300 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 8. Exercise Details API

## Endpoint Name
**Retrieve Exercise Details**

## HTTP Method
**GET**

## URL
`https://fitflow-api.com/api/exercises/{exerciseId}`

## Description
Fetches detailed information about a specific exercise, including instructions and benefits.

## Request Headers
| Header         | Value             | Description                        |
|---------------|------------------|------------------------------------|
| Authorization | Bearer <jwt_token> | Required for authentication       |
| Content-Type  | application/json  | Specifies request body format     |

## Response Example
```json
{
  "status": "success",
  "data": {
    "exerciseId": "ex12345",
    "name": "Push-Ups",
    "category": "Strength Training",
    "difficulty": "Medium",
    "instructions": "Start in a plank position, lower your body until your chest nearly touches the floor, then push yourself back up.",
    "musclesTargeted": ["Chest", "Triceps", "Shoulders"],
    "equipmentRequired": "None",
    "caloriesBurnedPerMin": 8
  }
}
```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Exercise details retrieved successfully | Exercise information returned     |
| 401 Unauthorized | Invalid or missing token | Authentication failure            |
| 404 Not Found | Exercise not found        | No exercise with given ID exists  |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Rate Limiting
- **Limit**: 500 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---
## API DOCUMENTATION FOR WORKOUT PLAN
---
# 1. Retrieve Workout Plans

## Endpoint Name
**GET Workout Plans**

## HTTP Method
**GET**

## URL
`https://fitflow-api.com/api/workouts/workout_plan`

## Description
Retrieves a list of workout plans, allowing filtering by exercise type, difficulty level, or duration.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json

```

## Response Example
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Full Body Workout",
      "exercise_type": "Strength",
      "difficulty": "Intermediate",
      "duration": 45,
      "exercises": [
        { "name": "Squats", "reps": 15 },
        { "name": "Push-ups", "reps": 10 }
      ]
    }
  ]
}

```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Successful Response           | Retrieved Workout Plan   |
| 400 Bad Request | Invalid input format  | Malformed invalid parameters      |
| 401 Unauthorized | Autentication Failed | Missing or invalid credentials    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Query Parameters
| Parameter       | Type     | Description                          |
|-----------------|----------|--------------------------------------|
| `exercise_type` | `string` | Filter by exercise type (e.g., Strength, Cardio). |
| `difficulty`    | `string` | Filter by difficulty level (e.g., Beginner, Advanced). |
| `duration`      | `number` | Filter by workout duration in minutes. |

## Rate Limiting
- **Limit**: 300 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 2. Create a Workout Plan

## Endpoint Name
**CREATE Workout Plans**

## HTTP Method
**POST**

## URL
`https://fitflow-api.com/api/workouts/workout_plan`

## Description
Creates a new workout plan by specifying its details and exercises.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "name": "Upper Body Strength",
  "exercise_type": "Strength",
  "difficulty": "Advanced",
  "duration": 60,
  "exercises": [
    { "name": "Bench Press", "reps": 12 },
    { "name": "Pull-ups", "reps": 8 }
  ]
}

```

## Response Example
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "name": "Upper Body Strength",
    "exercise_type": "Strength",
    "difficulty": "Advanced",
    "duration": 60,
    "exercises": [
      { "name": "Bench Press", "reps": 12 },
      { "name": "Pull-ups", "reps": 8 }
    ]
  }
}

```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Successful Response           | Workout plan successfully created.   |
| 400 Bad Request | Invalid input format  | The request body contained invalid data or was improperly formatted.      |
| 401 Unauthorized | Autentication Failed | Missing or invalid credentials    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Authentication
- **Required**: Yes.
- **Method**: Bearer token in the `Authorization` header.

## Rate Limiting
- **Limit**: 50 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---


# 3. Update a Workout Plan

## Endpoint Name
**UPDATE Workout Plans**

## HTTP Method
**PUT**

## URL
`https://fitflow-api.com/api/workouts/workout_plan/{id}`

## Description
Updates an existing workout plan by modifying its details.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json
{
  "name": "Full Body Strength",
  "duration": 50
}

```

## Response Example
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Full Body Strength",
    "exercise_type": "Strength",
    "difficulty": "Intermediate",
    "duration": 50,
    "exercises": [
      { "name": "Squats", "reps": 15 },
      { "name": "Push-ups", "reps": 10 }
    ]
  }
}

```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Successful Response           | Workout plan successfully updated.   |
| 400 Bad Request | Invalid input format  | The request body contained invalid data or was improperly formatted.      |
| 401 Unauthorized | Autentication Failed | Missing or invalid credentials    |
| 404 Not Found | ID does not exist | The specified workout plan ID does not exist.    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Authentication
- **Required**: Yes.
- **Method**: Bearer token in the `Authorization` header.

## Rate Limiting
- **Limit**: 50 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---

# 4. Delete a Workout Plan

## Endpoint Name
**DELETE Workout Plans**

## HTTP Method
**DELETE**

## URL
`https://fitflow-api.com/api/workouts/workout_plan/{id}`

## Description
Deletes a workout plan by its ID.

## Request Headers
| Header           | Value                 | Description                      |
|-----------------|----------------------|----------------------------------|
| Content-Type    | application/json     | Specifies request body format   |

## Request Body
```json

```

## Response Example
```json
{
  "status": "success",
  "message": "Workout plan deleted successfully."
}

```

## Response Codes
| Status Code | Meaning                     | Description                        |
|------------|----------------------------|------------------------------------|
| 200 OK     | Successful Response           | Workout plan successfully updated.   |
| 401 Unauthorized | Autentication Failed | Missing or invalid credentials    |
| 404 Not Found | ID does not exist | The specified workout plan ID does not exist.    |
| 500 Internal Server Error | Server error | Unexpected error on the server    |

## Authentication
- **Required**: Yes.
- **Method**: Bearer token in the `Authorization` header.

## Rate Limiting
- **Limit**: 20 requests per hour per user.
- **Response Code**: 429 Too Many Requests.

---
