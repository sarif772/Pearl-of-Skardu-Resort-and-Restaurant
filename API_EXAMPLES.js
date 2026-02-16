/**
 * PEARL OF SKARDU RESORT - BOOKING API
 * Testing & Integration Examples
 * 
 * Use these examples to test the API endpoints
 */

const API_BASE_URL = 'http://localhost:5000/api';

// ============ EXAMPLE 1: CREATE A NEW BOOKING ============

async function testCreateBooking() {
  console.log('\n📋 Testing: Create Booking...');
  
  const bookingData = {
    roomType: 'Luxury Suite',
    name: 'Ahmed Khan',
    phone: '+923489926060',
    email: 'ahmed.khan@example.com',
    checkIn: '2026-04-15',
    checkOut: '2026-04-20',
    guests: 3,
    message: 'Please arrange airport pickup and late check-in.'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
    return result.data;

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ EXAMPLE 2: GET ALL BOOKINGS (ADMIN) ============

async function testGetAllBookings() {
  console.log('\n📋 Testing: Get All Bookings...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings?status=Pending&sortBy=latest`);
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Total Bookings:', result.count);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ EXAMPLE 3: GET SINGLE BOOKING ============

async function testGetSingleBooking(bookingId) {
  console.log(`\n📋 Testing: Get Booking (ID: ${bookingId})...`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ EXAMPLE 4: GET BOOKING BY REFERENCE ============

async function testGetByReference() {
  console.log('\n📋 Testing: Get Booking by Reference...');
  
  try {
    // Replace with actual booking reference
    const response = await fetch(`${API_BASE_URL}/bookings/search/reference?reference=BK-ABC123XYZ456`);
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ EXAMPLE 5: UPDATE BOOKING STATUS ============

async function testUpdateBookingStatus(bookingId) {
  console.log(`\n📋 Testing: Update Booking Status (ID: ${bookingId})...`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'Confirmed'
      })
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ EXAMPLE 6: CANCEL BOOKING ============

async function testCancelBooking(bookingId) {
  console.log(`\n📋 Testing: Cancel Booking (ID: ${bookingId})...`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// ============ REAL-WORLD FORM INTEGRATION ============

/**
 * This function connects your HTML form to the API
 * Include this in your website JavaScript
 */

function setupBookingForm() {
  const form = document.getElementById('bookingForm');
  
  if (!form) {
    console.error('❌ Form with ID "bookingForm" not found');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
      // Collect form data
      const bookingData = {
        roomType: document.getElementById('roomType').value,
        name: document.getElementById('guestName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        checkIn: document.getElementById('checkIn').value,
        checkOut: document.getElementById('checkOut').value,
        guests: parseInt(document.getElementById('guests').value),
        message: document.getElementById('message').value || ''
      };

      // Send to API
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Show error messages
        let errorMsg = result.message || 'Booking failed';
        if (result.errors && Array.isArray(result.errors)) {
          errorMsg += '\n' + result.errors
            .map(e => `${e.field}: ${e.message}`)
            .join('\n');
        }
        throw new Error(errorMsg);
      }

      // Success - show confirmation
      alert(`✓ Booking Confirmed!\n\nReference: ${result.data.bookingReference}\nTotal: $${result.data.totalPrice}`);
      
      // Clear form
      form.reset();
      
      // Optionally redirect
      // window.location.href = '/booking-confirmation.html?ref=' + result.data.bookingReference;

    } catch (error) {
      alert(`❌ Booking Error:\n${error.message}`);
    } finally {
      // Restore button
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// ============ ERROR HANDLING EXAMPLES ============

/**
 * Common API error responses and how to handle them
 */

const ERROR_HANDLERS = {
  // 400 Bad Request - Validation error
  400: (error) => {
    if (error.errors) {
      console.error('Validation Errors:');
      error.errors.forEach(e => {
        console.error(`  ${e.field}: ${e.message}`);
      });
    }
  },

  // 404 Not Found - Booking doesn't exist
  404: (error) => {
    console.error('Booking not found:', error.message);
  },

  // 409 Conflict - Room not available
  409: (error) => {
    console.error('Availability conflict:', error.message);
    console.log('Please select different dates.');
  },

  // 500 Server Error
  500: (error) => {
    console.error('Server error:', error.message);
    console.log('Please try again later or contact support.');
  }
};

// ============ CURL EXAMPLES FOR TESTING ============

/*
// Test API health
curl http://localhost:5000/api/health

// Create a booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomType": "Luxury Suite",
    "name": "John Doe",
    "phone": "+923489926060",
    "email": "john@example.com",
    "checkIn": "2026-04-15",
    "checkOut": "2026-04-20",
    "guests": 2,
    "message": "Late check-in needed"
  }'

// Get all bookings
curl http://localhost:5000/api/bookings

// Get booking by ID
curl http://localhost:5000/api/bookings/507f1f77bcf86cd799439011

// Update booking status
curl -X PUT http://localhost:5000/api/bookings/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"status": "Confirmed"}'

// Cancel booking
curl -X DELETE http://localhost:5000/api/bookings/507f1f77bcf86cd799439011

// Get booking by reference
curl "http://localhost:5000/api/bookings/search/reference?reference=BK-ABC123XYZ456"
*/

// ============ VALIDATION RULES ============

const VALIDATION_RULES = {
  roomType: {
    required: true,
    options: ['Deluxe Room', 'Luxury Suite', 'VIP Suite']
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  phone: {
    required: true,
    pattern: '/^\\+?[0-9]{10,15}$/',
    example: '+923489926060'
  },
  email: {
    required: true,
    pattern: 'valid email format',
    example: 'guest@example.com'
  },
  checkIn: {
    required: true,
    format: 'YYYY-MM-DD',
    minDate: 'today'
  },
  checkOut: {
    required: true,
    format: 'YYYY-MM-DD',
    mustBeAfter: 'checkIn',
    maxDays: 90
  },
  guests: {
    required: true,
    min: 1,
    max: 10
  },
  message: {
    required: false,
    maxLength: 500
  }
};

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testCreateBooking,
    testGetAllBookings,
    testGetSingleBooking,
    testGetByReference,
    testUpdateBookingStatus,
    testCancelBooking,
    setupBookingForm,
    VALIDATION_RULES
  };
}
