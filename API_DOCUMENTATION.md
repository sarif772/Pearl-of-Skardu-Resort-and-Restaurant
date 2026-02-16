# Pearl of Skardu Resort - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/bookings` | Create new booking |
| GET | `/bookings` | Get all bookings (with filters) |
| GET | `/bookings/:id` | Get single booking by ID |
| GET | `/bookings/search/reference?reference=...` | Get booking by reference |
| PUT | `/bookings/:id` | Update booking status |
| DELETE | `/bookings/:id` | Cancel booking |

---

## 1️⃣ CREATE BOOKING

### Request
```http
POST /api/bookings HTTP/1.1
Content-Type: application/json

{
  "roomType": "Luxury Suite",
  "name": "John Doe",
  "phone": "+923489926060",
  "email": "john@example.com",
  "checkIn": "2026-04-15",
  "checkOut": "2026-04-20",
  "guests": 2,
  "message": "Please arrange early check-in if possible"
}
```

### Field Descriptions

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| roomType | String | Yes | "Deluxe Room", "Luxury Suite", or "VIP Suite" |
| name | String | Yes | 2-100 characters |
| phone | String | Yes | Valid format: +92XXXXXXXXX (10-15 digits) |
| email | String | Yes | Valid email format |
| checkIn | Date | Yes | Format: YYYY-MM-DD, not in past |
| checkOut | Date | Yes | Format: YYYY-MM-DD, must be after checkIn |
| guests | Number | Yes | Integer: 1-10 |
| message | String | No | Optional, max 500 characters |

### Success Response (201)
```json
{
  "status": "success",
  "message": "Booking created successfully. Confirmation email has been sent.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-1736424000000ABC123",
    "roomType": "Luxury Suite",
    "nights": 5,
    "totalPrice": 1750,
    "status": "Pending",
    "checkIn": "2026-04-15T00:00:00.000Z",
    "checkOut": "2026-04-20T00:00:00.000Z"
  }
}
```

### Error Responses

**Validation Error (400)**
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "checkOut",
      "value": "2026-04-10",
      "message": "Check-out date must be after check-in date"
    }
  ]
}
```

**Room Not Available (409)**
```json
{
  "status": "error",
  "message": "Luxury Suite is not available for the selected dates. Please choose different dates."
}
```

### Pricing
```
Deluxe Room: $200/night
Luxury Suite: $350/night
VIP Suite: $500/night
```

---

## 2️⃣ GET ALL BOOKINGS

### Request
```http
GET /api/bookings?status=Pending&roomType=Luxury%20Suite&sortBy=latest HTTP/1.1
```

### Query Parameters
| Parameter | Type | Options | Default |
|-----------|------|---------|---------|
| status | String | Pending, Confirmed, Cancelled | (none) |
| roomType | String | Deluxe Room, Luxury Suite, VIP Suite | (none) |
| sortBy | String | latest, price, checkIn | checkIn |

### Success Response (200)
```json
{
  "status": "success",
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "bookingReference": "BK-1736424000000ABC123",
      "roomType": "Luxury Suite",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+923489926060",
      "checkIn": "2026-04-15T00:00:00.000Z",
      "checkOut": "2026-04-20T00:00:00.000Z",
      "guests": 2,
      "message": "Please arrange early check-in",
      "status": "Pending",
      "totalPrice": 1750,
      "createdAt": "2026-02-09T10:30:45.123Z",
      "updatedAt": "2026-02-09T10:30:45.123Z"
    }
  ]
}
```

---

## 3️⃣ GET SINGLE BOOKING

### Request
```http
GET /api/bookings/507f1f77bcf86cd799439011 HTTP/1.1
```

### Success Response (200)
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-1736424000000ABC123",
    "roomType": "Luxury Suite",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+923489926060",
    "checkIn": "2026-04-15T00:00:00.000Z",
    "checkOut": "2026-04-20T00:00:00.000Z",
    "guests": 2,
    "message": "Please arrange early check-in",
    "status": "Pending",
    "totalPrice": 1750,
    "createdAt": "2026-02-09T10:30:45.123Z",
    "updatedAt": "2026-02-09T10:30:45.123Z"
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "message": "Booking not found"
}
```

---

## 4️⃣ GET BOOKING BY REFERENCE

### Request
```http
GET /api/bookings/search/reference?reference=BK-1736424000000ABC123 HTTP/1.1
```

### Success Response (200)
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-1736424000000ABC123",
    ...
  }
}
```

### Error Response (404)
```json
{
  "status": "error",
  "message": "Booking not found"
}
```

---

## 5️⃣ UPDATE BOOKING STATUS

### Request
```http
PUT /api/bookings/507f1f77bcf86cd799439011 HTTP/1.1
Content-Type: application/json

{
  "status": "Confirmed"
}
```

### Valid Status Values
- `Pending` - New booking, awaiting confirmation
- `Confirmed` - Booking confirmed and approved
- `Cancelled` - Booking cancelled by customer or admin

### Success Response (200)
```json
{
  "status": "success",
  "message": "Booking status updated to Confirmed",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-1736424000000ABC123",
    "status": "Confirmed",
    ...
  }
}
```

---

## 6️⃣ CANCEL BOOKING

### Request
```http
DELETE /api/bookings/507f1f77bcf86cd799439011 HTTP/1.1
```

### Success Response (200)
```json
{
  "status": "success",
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-1736424000000ABC123",
    "status": "Cancelled",
    ...
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Booking created successfully |
| 400 | Bad Request - Validation error |
| 404 | Not Found - Booking doesn't exist |
| 409 | Conflict - Room not available for dates |
| 500 | Server Error - Internal error |

---

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [ ... ]  // Optional, for validation errors
}
```

---

## Frontend Integration Full Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Book Now</title>
</head>
<body>
  <form id="bookingForm">
    <select id="roomType" required>
      <option value="">Select Room</option>
      <option value="Deluxe Room">Deluxe Room - $200/night</option>
      <option value="Luxury Suite">Luxury Suite - $350/night</option>
      <option value="VIP Suite">VIP Suite - $500/night</option>
    </select>
    
    <input type="text" id="guestName" placeholder="Full Name" required>
    <input type="tel" id="phone" placeholder="+92..." required>
    <input type="email" id="email" placeholder="Email" required>
    <input type="date" id="checkIn" required>
    <input type="date" id="checkOut" required>
    <input type="number" id="guests" min="1" max="10" required>
    <textarea id="message" placeholder="Special requests"></textarea>
    
    <button type="submit">Book Now</button>
  </form>

  <script src="API_EXAMPLES.js"></script>
  <script>
    // Initialize form when page loads
    document.addEventListener('DOMContentLoaded', setupBookingForm);
  </script>
</body>
</html>
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP address
- **Headers:** 
  - `RateLimit-Limit: 100`
  - `RateLimit-Remaining: 99`
  - `RateLimit-Reset: 1639068300`

---

## Database Schema

```javascript
{
  roomType: String,           // "Deluxe Room" | "Luxury Suite" | "VIP Suite"
  name: String,               // Guest's full name
  phone: String,              // Phone number with country code
  email: String,              // Valid email address
  checkIn: Date,              // Check-in date
  checkOut: Date,             // Check-out date
  guests: Number,             // 1-10
  message: String,            // Optional special requests
  status: String,             // "Pending" | "Confirmed" | "Cancelled"
  totalPrice: Number,         // Calculated: nights * pricePerRoom
  bookingReference: String,   // Unique reference like "BK-ABC123XYZ456"
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

---

**Last Updated:** February 9, 2026  
**Version:** 1.0.0
