# Pearl of Skardu Resort - Booking Backend API

Complete Node.js/Express/MongoDB backend system for the Pearl of Skardu Resort & Restaurant booking feature.

## 📋 Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Email Configuration](#email-configuration)
- [Project Structure](#project-structure)
- [Security Features](#security-features)

## ✨ Features

✅ Complete booking management system  
✅ Room availability validation  
✅ Automatic booking reference generation  
✅ Email confirmations to customers and admin  
✅ Form validation with detailed error messages  
✅ MongoDB database integration  
✅ RESTful API architecture  
✅ CORS enabled for frontend integration  
✅ Rate limiting for security  
✅ MongoDB sanitization against injection attacks  
✅ Professional error handling  

## 📦 Requirements

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **npm** (comes with Node.js)
- An email account (Gmail or SMTP server)

## 🚀 Installation

### 1. Clone/Download Project
```bash
cd hotel-backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB ODM)
- dotenv (environment variables)
- express-validator (form validation)
- nodemailer (email service)
- cors (cross-origin requests)
- helmet (security headers)
- express-rate-limit (rate limiting)

### 3. Setup Environment Variables
```bash
# Copy example file
cp .env.example .env

# Edit .env with your configuration
# nano .env  (or use your text editor)
```

## ⚙️ Configuration

### `.env` File Setup

#### Database Configuration
```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/pearl-of-skardu-resort

# OR MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

#### Email Configuration (Gmail)
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Get app password:
# 1. Enable 2-step verification on Gmail account
# 2. Go to https://myaccount.google.com/apppasswords
# 3. Select Mail and Windows Computer
# 4. Copy the 16-character password
```

#### Email Configuration (Custom SMTP)
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

#### Other Settings
```env
NODE_ENV=development      # or production
PORT=5000                 # API port
CORS_ORIGIN=http://localhost:3000    # Frontend URL
ADMIN_EMAIL=admin@pearlofskarduresort.com
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

**Windows:**
```bash
# Install MongoDB Community Edition from:
# https://www.mongodb.com/try/download/community

# Start MongoDB service
mongod
```

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
5. Add to `.env` file

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

You should see:
```
========================================
Pearl of Skardu Resort - Booking API
Server running on port 5000
Environment: development
========================================
```

Test the server:
```bash
curl http://localhost:5000/
```

## 📡 API Endpoints

### 1. Create Booking
**POST** `/api/bookings`

**Request:**
```json
{
  "roomType": "Luxury Suite",
  "name": "John Doe",
  "phone": "+923489926060",
  "email": "john@example.com",
  "checkIn": "2026-03-15",
  "checkOut": "2026-03-18",
  "guests": 2,
  "message": "Please arrange late check-in"
}
```

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Booking created successfully. Confirmation email has been sent.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-ABC123XYZ456",
    "roomType": "Luxury Suite",
    "nights": 3,
    "totalPrice": 1050,
    "status": "Pending",
    "checkIn": "2026-03-15T00:00:00.000Z",
    "checkOut": "2026-03-18T00:00:00.000Z"
  }
}
```

### 2. Get All Bookings (Admin)
**GET** `/api/bookings?status=Pending&sortBy=latest`

**Query Parameters:**
- `status` - Filter by status: Pending, Confirmed, Cancelled
- `roomType` - Filter by room type
- `sortBy` - Sort by: latest, price (default: check-in date)

**Response:**
```json
{
  "status": "success",
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "bookingReference": "BK-ABC123XYZ456",
      "roomType": "Luxury Suite",
      ...
    }
  ]
}
```

### 3. Get Single Booking
**GET** `/api/bookings/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "bookingReference": "BK-ABC123XYZ456",
    ...
  }
}
```

### 4. Get Booking by Reference
**GET** `/api/bookings/search/reference?reference=BK-ABC123XYZ456`

**Response:**
```json
{
  "status": "success",
  "data": { ... }
}
```

### 5. Update Booking Status
**PUT** `/api/bookings/:id`

**Request:**
```json
{
  "status": "Confirmed"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Booking status updated to Confirmed",
  "data": { ... }
}
```

### 6. Cancel Booking
**DELETE** `/api/bookings/:id`

**Response:**
```json
{
  "status": "success",
  "message": "Booking cancelled successfully",
  "data": { ... }
}
```

## 🔗 Frontend Integration

### JavaScript Example - Create Booking

```javascript
// API configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Function to create booking
async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Booking failed');
    }

    console.log('Booking successful!', result.data);
    alert(`Booking Reference: ${result.data.bookingReference}`);
    return result.data;

  } catch (error) {
    console.error('Error:', error);
    alert(`Error: ${error.message}`);
  }
}

// Example usage - Hook this to your Book Now button
document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const bookingData = {
    roomType: document.getElementById('roomType').value,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    checkIn: document.getElementById('checkIn').value,
    checkOut: document.getElementById('checkOut').value,
    guests: parseInt(document.getElementById('guests').value),
    message: document.getElementById('message').value
  };

  await createBooking(bookingData);
});
```

### Example HTML Form
```html
<form id="bookingForm">
  <select id="roomType" required>
    <option value="">Select Room Type</option>
    <option value="Deluxe Room">Deluxe Room - $200/night</option>
    <option value="Luxury Suite">Luxury Suite - $350/night</option>
    <option value="VIP Suite">VIP Suite - $500/night</option>
  </select>

  <input type="text" id="name" placeholder="Full Name" required>
  <input type="tel" id="phone" placeholder="Phone Number" required>
  <input type="email" id="email" placeholder="Email Address" required>
  <input type="date" id="checkIn" required>
  <input type="date" id="checkOut" required>
  <input type="number" id="guests" min="1" max="10" required>
  <textarea id="message" placeholder="Special Requests (optional)"></textarea>

  <button type="submit">Book Now</button>
</form>
```

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-step verification: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
   ```

### Custom SMTP (e.g., SendGrid, AWS SES)
Add to `.env`:
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-api-key
```

## 📁 Project Structure

```
hotel-backend/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                       # Environment variables (create from .env.example)
├── .env.example               # Template for .env
├── README.md                  # This file
│
├── models/
│   └── Booking.js            # MongoDB Booking schema
│
├── controllers/
│   └── bookingController.js  # Business logic for bookings
│
├── routes/
│   └── bookingRoutes.js      # API endpoints
│
├── middlewares/
│   └── validation.js         # Form validation rules
│
└── utils/
    └── emailService.js       # Email sending functions
```

## 🔒 Security Features

✅ **Input Validation** - All inputs validated with express-validator  
✅ **MongoDB Sanitization** - Prevents NoSQL injection attacks  
✅ **CORS Protection** - Configurable cross-origin requests  
✅ **Rate Limiting** - 100 requests per 15 minutes per IP  
✅ **Security Headers** - Helmet.js adds HTTP security headers  
✅ **Duplicate Prevention** - Prevents double-booking same room/dates  
✅ **Email Validation** - RFC-compliant email format checking  
✅ **Date Validation** - Check-out must be after check-in  
✅ **Environment Variables** - Sensitive data never hardcoded  

## 📊 Room Pricing

| Room Type | Price per Night |
|-----------|-----------------|
| Deluxe Room | $200 |
| Luxury Suite | $350 |
| VIP Suite | $500 |

Prices are calculated automatically based on number of nights.

## 🐛 Troubleshooting

**MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running locally or update MONGODB_URI in .env

**Email Service Error**
```
Error: Invalid login - 535-5.7.8 Username and password not accepted
```
Solution: 
- For Gmail: Use app-specific password, not your regular Gmail password
- Enable 2-step verification first

**CORS Error in Frontend**
```
Access to XMLHttpRequest blocked by CORS policy
```
Solution: Update CORS_ORIGIN in .env to match your frontend URL

## 📞 Support & Maintenance

- **Server Logs:** Check console output for errors
- **Database Logs:** Use MongoDB Compass or MongoDB Atlas UI
- **Email Testing:** Use https://mailtrap.io/ for development

## 🚀 Production Deployment

### For Heroku:
```bash
heroku create pearl-of-skardu-api
git push heroku main
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set EMAIL_PASSWORD=your-password
```

### For AWS, DigitalOcean, or your server:
```bash
# Install Node.js and MongoDB
# Clone repository
npm install
# Create .env with production variables
# Set NODE_ENV=production
npm start
```

## 📝 License

This project is proprietary software for Pearl of Skardu Resort & Restaurant.

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready
