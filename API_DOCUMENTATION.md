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
---
