// ===================================
// NAVIGATION BAR FUNCTIONALITY
// ===================================

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navbar = document.getElementById('navbar');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (navLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ===================================
// SMOOTH SCROLLING
// ===================================

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Hero scroll button
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
    heroScroll.addEventListener('click', () => {
        const quickInfo = document.querySelector('.quick-info');
        if (quickInfo) {
            quickInfo.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// PACKAGE SELECTION
// ===================================

const selectPackageBtns = document.querySelectorAll('.select-package');
const packageSelect = document.getElementById('package');

selectPackageBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const packageType = e.target.getAttribute('data-package');
        
        // Scroll to booking form
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Set the package in the select dropdown
        if (packageType === 'complete') {
            packageSelect.value = 'complete';
        } else if (packageType === 'modular') {
            // Don't pre-select, let user choose
            packageSelect.value = '';
        } else if (packageType === 'group') {
            packageSelect.value = 'group';
            // Also update guest count to minimum 5
            const guestsInput = document.getElementById('guests');
            if (guestsInput && parseInt(guestsInput.value) < 5) {
                guestsInput.value = '5';
            }
        }
        
        // Highlight the form briefly
        const formContainer = document.querySelector('.booking-form-container');
        if (formContainer) {
            formContainer.style.boxShadow = '0 0 20px rgba(45, 122, 79, 0.3)';
            setTimeout(() => {
                formContainer.style.boxShadow = '';
            }, 2000);
        }
    });
});

// Update guest count validation for group packages
const guestsInput = document.getElementById('guests');
packageSelect.addEventListener('change', (e) => {
    if (e.target.value === 'group') {
        if (guestsInput && parseInt(guestsInput.value) < 5) {
            guestsInput.value = '5';
            guestsInput.min = '5';
        }
    } else {
        if (guestsInput) {
            guestsInput.min = '1';
        }
    }
});

// ===================================
// FORM VALIDATION AND SUBMISSION
// ===================================

const bookingForm = document.getElementById('bookingForm');

// Set minimum date to today
const checkInInput = document.getElementById('checkIn');
if (checkInInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.setAttribute('min', today);
}

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(bookingForm);
    const data = {};
    
    formData.forEach((value, key) => {
        if (bookingForm.elements[key].type === 'checkbox') {
            data[key] = bookingForm.elements[key].checked;
        } else {
            data[key] = value;
        }
    });
    
    // Validate required fields
    if (!data.fullName || !data.email || !data.phone || !data.guests || !data.package || !data.checkIn) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Validate phone format (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Check terms acceptance
    if (!data.terms) {
        showNotification('Please accept the terms and conditions.', 'error');
        return;
    }
    
    // No group package validation needed with new pricing structure
    
    // Calculate total price
    const totalPrice = calculatePrice(data);
    
    // Show confirmation
    showBookingConfirmation(data, totalPrice);
});

// ===================================
// PRICE CALCULATION
// ===================================

function calculatePrice(data) {
    let basePrice = 0;
    
    // Calculate base price based on package
    switch(data.package) {
        case 'complete':
            basePrice = 4500 * parseInt(data.guests);
            break;
        case 'day1':
            basePrice = 1500 * parseInt(data.guests);
            break;
        case 'day2':
            basePrice = 1300 * parseInt(data.guests);
            break;
        case 'day3':
            basePrice = 1700 * parseInt(data.guests);
            break;
        case 'day1-2':
            basePrice = 2800 * parseInt(data.guests);
            break;
        case 'day2-3':
            basePrice = 3000 * parseInt(data.guests);
            break;
        case 'day1-3':
            basePrice = 3200 * parseInt(data.guests);
            break;
        default:
            basePrice = 0;
    }
    
    // Add optional activities
    if (data.ecocamp) {
        basePrice += 500 * parseInt(data.guests);
    }
    
    if (data.nightPrograms) {
        basePrice += 350 * parseInt(data.guests);
    }
    
    if (data.heritageFood) {
        basePrice += 250 * parseInt(data.guests);
    }
    
    if (data.conservation) {
        basePrice += 150 * parseInt(data.guests);
    }
    
    return basePrice;
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: transparent;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 1rem;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===================================
// BOOKING CONFIRMATION MODAL
// ===================================

function showBookingConfirmation(data, totalPrice) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <i class="fas fa-check-circle"></i>
                <h2>Booking Summary</h2>
            </div>
            <div class="modal-body">
                <div class="booking-details">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${data.fullName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value">${data.email}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${data.phone}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Package:</span>
                        <span class="detail-value">${getPackageName(data.package)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Number of Guests:</span>
                        <span class="detail-value">${data.guests}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Start Date:</span>
                        <span class="detail-value">${formatDate(data.checkIn)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Accommodation:</span>
                        <span class="detail-value">${getAccommodationName(data.accommodation)}</span>
                    </div>
                    ${data.ecocamp ? '<div class="detail-row"><span class="detail-label">Eco-Camp Experience:</span><span class="detail-value">✓ Included</span></div>' : ''}
                    ${data.nightPrograms ? '<div class="detail-row"><span class="detail-label">Night Programs:</span><span class="detail-value">✓ Included</span></div>' : ''}
                    ${data.heritageFood ? '<div class="detail-row"><span class="detail-label">Heritage Food Tasting:</span><span class="detail-value">✓ Included</span></div>' : ''}
                    ${data.conservation ? '<div class="detail-row"><span class="detail-label">Conservation Activities:</span><span class="detail-value">✓ Included</span></div>' : ''}
                    <div class="detail-row total-price">
                        <span class="detail-label">Total Price:</span>
                        <span class="detail-value">₱${totalPrice.toLocaleString()}</span>
                    </div>
                </div>
                <p class="confirmation-note">
                    <i class="fas fa-info-circle"></i>
                    Thank you for your booking! We'll send a confirmation email to <strong>${data.email}</strong> with payment instructions and additional details.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-btn" onclick="this.closest('.booking-modal').remove()">Close</button>
                <button class="btn btn-primary modal-btn" onclick="confirmAndSubmit()">Confirm Booking</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
        }
        
        .modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .modal-close:hover {
            background: #f0f0f0;
            color: #333;
        }
        
        .modal-header {
            text-align: center;
            padding: 2rem;
            border-bottom: 2px solid #e8f5e9;
        }
        
        .modal-header i {
            font-size: 4rem;
            color: #27ae60;
            margin-bottom: 1rem;
        }
        
        .modal-header h2 {
            color: #1a3a2e;
            margin: 0;
        }
        
        .modal-body {
            padding: 2rem;
        }
        
        .booking-details {
            background: #f9f9f9;
            padding: 1.5rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 0.7rem 0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        
        .detail-value {
            color: #333;
            text-align: right;
        }
        
        .total-price {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid #2d7a4f !important;
        }
        
        .total-price .detail-label,
        .total-price .detail-value {
            font-size: 1.3rem;
            font-weight: bold;
            color: #2d7a4f;
        }
        
        .confirmation-note {
            background: #e3f2fd;
            padding: 1rem;
            border-radius: 8px;
            color: #1976d2;
            display: flex;
            gap: 0.5rem;
            align-items: start;
        }
        
        .confirmation-note i {
            margin-top: 3px;
        }
        
        .modal-footer {
            padding: 1.5rem 2rem;
            border-top: 2px solid #e8f5e9;
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .modal-btn {
            padding: 0.8rem 2rem;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: 10px;
            }
            
            .modal-footer {
                flex-direction: column;
            }
            
            .modal-btn {
                width: 100%;
            }
            
            .detail-row {
                flex-direction: column;
                gap: 0.3rem;
            }
            
            .detail-value {
                text-align: left;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on close button
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
}

// ===================================
// HELPER FUNCTIONS
// ===================================

function getPackageName(packageCode) {
    const packages = {
        'complete': 'Full 3-Day Package - ₱4,500',
        'day1': 'Day 1: Water & Forest Awakening (Natural) - ₱1,500',
        'day2': 'Day 2: Culture, Farms & Everyday Highlands (Cultural) - ₱1,300',
        'day3': 'Day 3: Ridges, Cafés & Sky Serenity (Man-made) - ₱1,700',
        'day1-2': 'Day 1 & Day 2 - ₱2,800',
        'day2-3': 'Day 2 & Day 3 - ₱3,000',
        'day1-3': 'Day 1 & Day 3 - ₱3,200'
    };
    return packages[packageCode] || packageCode;
}

function getAccommodationName(accommodationCode) {
    const accommodations = {
        'eco-camp': 'Eco-Camp',
        'homestay': 'Community Homestay',
        'lodge': 'Eco-Lodge'
    };
    return accommodations[accommodationCode] || accommodationCode;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Global function for confirm button
window.confirmAndSubmit = function() {
    // In a real application, this would submit to a server
    const modal = document.querySelector('.booking-modal');
    if (modal) {
        modal.remove();
    }
    
    showNotification('Booking confirmed! Check your email for details.', 'success');
    
    // Reset form
    bookingForm.reset();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Intersection Observer for fade-in animations
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

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.info-card, .day-section, .sustainability-card, .testimonial-card, .package-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================================
// DYNAMIC YEAR IN FOOTER
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }
});

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌲 North Highway District Eco-Trail 🌲', 'color: #2d7a4f; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to sustainable tourism!', 'color: #52a679; font-size: 14px;');
console.log('%cFor inquiries: info@ecotrail-bukidnon.ph', 'color: #666; font-size: 12px;');

