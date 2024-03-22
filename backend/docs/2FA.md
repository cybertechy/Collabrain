# Two Factor authentication REST API

## Enable 2FA for a user
PATCH /api/2fa/enable

# Request 
Headers: 
Authorization: Bearer <token>

---
## Disable 2FA for a user
PATCH /api/2fa/disable

# Request
Headers:
Authorization: Bearer token

---
## 2FA Status for a user
GET /api/2fa/status

# Request
Headers:
Authorization: Bearer token

# Response
{
  "twoFA": true
}

---
## Send 2FA code to user
POST /api/2fa/send

# Request
Headers:
Authorization: Bearer token

# Response
{
  "message": "Code sent"
}

---
## Verify 2FA code
POST /api/2fa/verify

# Request
Headers:
Authorization: Bearer token
Body:
{
  "code": 123456
}

# Response
Response: 200 for success
          400 for failure
{
  "message": "Invalid Code" / "Code verified"
}




