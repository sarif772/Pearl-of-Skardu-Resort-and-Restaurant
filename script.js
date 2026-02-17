// Sticky Navbar
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gallery Modal (Simple Implementation)
const galleryImages = document.querySelectorAll('.gallery-grid img');
const galleryModal = document.createElement('div');
galleryModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    cursor: pointer;
`;
galleryModal.innerHTML = '<img style="max-width: 90%; max-height: 90%; object-fit: contain;">';
document.body.appendChild(galleryModal);

galleryImages.forEach(img => {
    img.addEventListener('click', () => {
        galleryModal.querySelector('img').src = img.src;
        galleryModal.style.display = 'flex';
    });
});

galleryModal.addEventListener('click', () => {
    galleryModal.style.display = 'none';
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Booking Modal Functionality
const modal = document.getElementById('booking-modal');
const closeBtn = document.querySelector('.close');
const bookingForm = document.getElementById('booking-form');

// Open modal for booking buttons
const bookButtons = document.querySelectorAll('.book-btn, .book-now-btn, .cta-btn');
bookButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Book Now button clicked!'); // Debug alert
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Form submission
bookingForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Collect form data
    const formData = new FormData(this);
    const bookingData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        roomType: formData.get('roomType'),
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        guests: parseInt(formData.get('guests')),
        message: formData.get('message')
    };

    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (response.ok) {
            // Success
            const successMessage = document.createElement('div');
            successMessage.className = 'message success';
            successMessage.textContent = 'Booking submitted successfully! We will contact you soon.';
            bookingForm.insertBefore(successMessage, submitBtn);

            // Reset form
            this.reset();

            // Close modal after 3 seconds
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 3000);
        } else {
            // Error
            const errorMessage = document.createElement('div');
            errorMessage.className = 'message error';
            errorMessage.textContent = result.message || 'Failed to submit booking. Please try again.';
            bookingForm.insertBefore(errorMessage, submitBtn);
        }
    } catch (error) {
        console.error('Error submitting booking:', error);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message error';
        errorMessage.textContent = 'Network error. Please check your connection and try again.';
        bookingForm.insertBefore(errorMessage, submitBtn);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Menu and Reserve Button Alerts
const otherButtons = document.querySelectorAll('.menu-btn, .reserve-btn');
otherButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.classList.contains('menu-btn')) {
            alert('Menu download feature coming soon!');
        } else if (this.classList.contains('reserve-btn')) {
            alert('Table reservation system coming soon!');
        }
    });
});

// Newsletter Subscription
const newsletterForm = document.querySelector('footer form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        this.reset();
    });
}

// Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ===============================
// Mobile Hamburger Menu Toggle
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {

        hamburger.addEventListener("click", function () {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            document.body.classList.toggle("menu-open");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", function () {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
                document.body.classList.remove("menu-open");
            });
        });

    }

});

