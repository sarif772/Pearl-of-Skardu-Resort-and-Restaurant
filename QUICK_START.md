# 🚀 Quick Start Guide - Pearl of Skardu Resort Backend

## ⏱️ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd hotel-backend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Edit `.env` and add:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pearl-of-skardu-resort
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start MongoDB
```bash
# Windows - use MongoDB Compass or run:
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Step 4: Start Server
```bash
npm run dev
```

You should see:
```
========================================
Pearl of Skardu Resort - Booking API
Server running on port 5000
Environment: development
========================================
```

### Step 5: Test the API
```bash
curl http://localhost:5000/api/health
```

---

## 📂 Project Structure

```
hotel-backend/
├── server.js                 ← Main server file
├── package.json              ← Dependencies
├── .env                       ← Your configuration (create from .env.example)
├── .env.example               ← Template
├── .gitignore                ← Git ignore file
│
├── models/
│   └── Booking.js            ← Database schema
│
├── controllers/
│   └── bookingController.js  ← Business logic
│
├── routes/
│   └── bookingRoutes.js      ← API endpoints
│
├── middlewares/
│   └── validation.js         ← Form validation
│
├── utils/
│   └── emailService.js       ← Email sending
│
└── Documentation/
    ├── README.md             ← Full documentation
    ├── API_DOCUMENTATION.md  ← API reference
    ├── API_EXAMPLES.js       ← Code examples
    └── QUICK_START.md        ← This file
```

---

## 🔧 Configuration

### Minimal Setup (Testing)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pearl-of-skardu-resort
```

### Full Setup (Production)
See `.env.example` for all options including:
- Email configuration (Gmail or SMTP)
- CORS settings
- Database connection strings
- Admin email for notifications

---

## 📡 API Endpoints

### Create Booking
```bash
POST /api/bookings
Content-Type: application/json

{
  "roomType": "Luxury Suite",
  "name": "John Doe",
  "phone": "+923489926060",
  "email": "john@example.com",
  "checkIn": "2026-04-15",
  "checkOut": "2026-04-20",
  "guests": 2,
  "message": "Optional special requests"
}
```

### Get All Bookings
```bash
GET /api/bookings?status=Pending&sortBy=latest
```

### Get Single Booking
```bash
GET /api/bookings/507f1f77bcf86cd799439011
```

### Get by Reference
```bash
GET /api/bookings/search/reference?reference=BK-ABC123XYZ456
```

### Update Status
```bash
PUT /api/bookings/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "status": "Confirmed"
}
```

### Cancel Booking
```bash
DELETE /api/bookings/507f1f77bcf86cd799439011
```

---

## 💻 Frontend Integration

### 1. Update your HTML form
```html
<form id="bookingForm">
  <select id="roomType" required>
    <option value="Deluxe Room">Deluxe Room - $200/night</option>
    <option value="Luxury Suite">Luxury Suite - $350/night</option>
    <option value="VIP Suite">VIP Suite - $500/night</option>
  </select>
  
  <input type="text" id="guestName" placeholder="Full Name" required>
  <input type="tel" id="phone" placeholder="Phone" required>
  <input type="email" id="email" placeholder="Email" required>
  <input type="date" id="checkIn" required>
  <input type="date" id="checkOut" required>
  <input type="number" id="guests" min="1" max="10" required>
  <textarea id="message" placeholder="Special Requests"></textarea>
  
  <button type="submit">Book Now</button>
</form>
```

### 2. Add JavaScript (in your website's script.js or HTML)
```javascript
const API_URL = 'http://localhost:5000/api';

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    roomType: document.getElementById('roomType').value,
    name: document.getElementById('guestName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    checkIn: document.getElementById('checkIn').value,
    checkOut: document.getElementById('checkOut').value,
    guests: parseInt(document.getElementById('guests').value),
    message: document.getElementById('message').value
  };
  
  try {
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      alert(`✓ Booking Confirmed!\nReference: ${result.data.bookingReference}\nTotal: $${result.data.totalPrice}`);
      document.getElementById('bookingForm').reset();
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
});
```

---

## 📧 Email Configuration

### Option 1: Gmail (Easiest)
1. Go to https://myaccount.google.com/apppasswords
2. Enable 2-step verification
3. Generate app password
4. Add to `.env`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

### Option 2: Custom SMTP
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-password
```

---

## 🧪 Testing

### Using curl
```bash
# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "Luxury Suite",
    "name": "Test User",
    "phone": "+923489926060",
    "email": "test@example.com",
    "checkIn": "2026-04-15",
    "checkOut": "2026-04-20",
    "guests": 2
  }'

# Get all bookings
curl http://localhost:5000/api/bookings

# Get single booking
curl http://localhost:5000/api/bookings/ID_HERE
```

### Using Postman
1. Import Collection (or create manually)
2. Create environment variable: `{{api_url}} = http://localhost:5000/api`
3. Create requests for each endpoint
4. Test with real data

---

## ⚠️ Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Make sure MongoDB is running (`mongod` on Windows/Linux or `brew services start mongodb-community` on Mac)

### Port 5000 Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill the process using port 5000

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Update `CORS_ORIGIN` in `.env` to match your frontend URL

### Email Service Error
```
Error: Invalid login
```
**Solution:** 
- For Gmail: Use app-specific password, not your regular password
- Enable 2-step verification first at https://myaccount.google.com/security

---

## 📊 Database

### View Bookings in MongoDB

**MongoDB CLI:**
```bash
mongosh
use pearl-of-skardu-resort
db.bookings.find()
```

**MongoDB Compass GUI:**
1. Download: https://www.mongodb.com/products/compass
2. Connect to `mongodb://localhost:27017`
3. Browse collections

---

## 🚀 Deployment

### Heroku
```bash
heroku create pearl-of-skardu-api
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set EMAIL_PASSWORD=your-password
```

### DigitalOcean / AWS / VPS
```bash
# Clone repo
git clone your-repo
cd hotel-backend

# Install
npm install

# Create .env
nano .env

# Start
npm start
```

---

## 📚 Documentation

- **Full Docs:** See `README.md`
- **API Reference:** See `API_DOCUMENTATION.md`
- **Code Examples:** See `API_EXAMPLES.js`

---

## 💡 Support

**Check logs:**
```bash
# Server logs - shown in terminal when running npm run dev
# Database logs - check MongoDB Compass or mongo shell
# Email logs - check console output and email service dashboard
```

---

## ✅ Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB installed and running
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Server starts without errors (`npm run dev`)
- [ ] Test API endpoint: `curl http://localhost:5000/api/health`
- [ ] Frontend form created and integrated
- [ ] Booking form submits successfully
- [ ] Confirmation email received (if configured)
- [ ] Admin email notification received (if configured)

---

**Version:** 1.0.0  
**Last Updated:** February 9, 2026  
**Status:** Production Ready ✅
