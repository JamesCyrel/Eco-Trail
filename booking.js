// ===================================
// BOOKING PAGE - CUSTOM BOOKING LOGIC
// ===================================

// Price configuration (in Philippine Peso)
const PRICES = {
    packages: {
        full: 4500,
        natural: 1500,
        cultural: 1300,
        manmade: 1700
    },
    addons: {
        ecocamp: 500,
        night: 350,
        food: 250,
        conservation: 150
    },
    discounts: {
        STUDENT20: 0.20  // 20% discount for groups of 10+ people
    }
};

let currentBooking = {
    packageType: 'full',
    numberOfPeople: 1,
    day1Activity: null,
    day2Activity: null,
    day3Activity: null,
    addons: [],
    discountCode: null,
    discountAmount: 0,
    selectedEcoCamp: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on the booking page
    if (document.getElementById('customBookingForm')) {
        initializeDatePicker();
        initializeEventListeners();
        updatePriceSummary();
    }
});

function initializeDatePicker() {
    // Set minimum date to today
    const tourStartDate = document.getElementById('tourStartDate');
    if (tourStartDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const minDate = today.toISOString().split('T')[0];
        tourStartDate.setAttribute('min', minDate);
        
        // Calculate end date when start date changes
        tourStartDate.addEventListener('change', calculateEndDate);
    }
    
    // Calculate end date when days are selected/deselected
    // This will be called from updatePriceSummary
}

function calculateEndDate() {
    const startDateInput = document.getElementById('tourStartDate');
    const endDateInput = document.getElementById('tourEndDate');
    
    if (!startDateInput || !endDateInput || !startDateInput.value) {
        return;
    }
    
    const startDate = new Date(startDateInput.value);
    if (isNaN(startDate.getTime())) {
        return;
    }
    
    // Count selected days
    let selectedDays = 0;
    if (currentBooking.day1Activity) selectedDays++;
    if (currentBooking.day2Activity) selectedDays++;
    if (currentBooking.day3Activity) selectedDays++;
    
    // If full package, it's 3 days
    if (currentBooking.packageType === 'full') {
        selectedDays = 3;
    }
    
    // If no days selected, don't calculate end date
    if (selectedDays === 0) {
        endDateInput.value = '';
        return;
    }
    
    // Calculate end date (start date + number of days - 1, since start date is day 1)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + selectedDays - 1);
    
    // Format date for input
    const endDateString = endDate.toISOString().split('T')[0];
    endDateInput.value = endDateString;
}

function initializeEventListeners() {
    // Package selection (both regular and modal versions)
    const packageOptions = document.querySelectorAll('.package-option, .package-option-modal');
    packageOptions.forEach(option => {
        option.addEventListener('click', function() {
            packageOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            const packageType = radio.value;
            handlePackageChange(packageType);
        });
    });

    // Number of people change
    const numberOfPeopleSelect = document.getElementById('numberOfPeople');
    numberOfPeopleSelect.addEventListener('change', (e) => {
        let value = e.target.value;
        
        // Handle range values
        if (value === '6-10') {
            currentBooking.numberOfPeople = 6;
        } else if (value === '10+') {
            currentBooking.numberOfPeople = 10;
        } else {
            currentBooking.numberOfPeople = parseInt(value) || 1;
        }
        
        updatePriceSummary();
    });

    // Activity type selection (both regular and modal versions)
    const activityCards = document.querySelectorAll('.activity-type-card, .activity-card-modal');
    activityCards.forEach(card => {
        card.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            const type = this.getAttribute('data-type');
            
            // Remove selected class from siblings
            const siblings = document.querySelectorAll(`.activity-type-card[data-day="${day}"]`);
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Update radio button
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Update booking data
            currentBooking[`day${day}Activity`] = type;
            
            updatePriceSummary();
            calculateEndDate();
        });
    });

    // Add-on selection (both regular and modal versions)
    const addonCards = document.querySelectorAll('.addon-card, .addon-card-modal');
    addonCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                card.classList.add('selected');
                const addonValue = parseInt(this.value);
                const addonName = this.name.replace('addon_', '');
                currentBooking.addons.push({ name: addonName, price: addonValue });
        } else {
            card.classList.remove('selected');
            const addonName = this.name.replace('addon_', '');
            currentBooking.addons = currentBooking.addons.filter(addon => addon.name !== addonName);
            
            // Clear eco-camp selection if ecocamp addon is unchecked
            if (addonName === 'ecocamp') {
                clearEcoCampSelection();
            }
        }
        
        updatePriceSummary();
    });
});

    // Payment method selection (both regular and modal versions)
    const paymentMethods = document.querySelectorAll('.payment-method, .payment-method-modal');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
            
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Discount code application
    const applyDiscountBtn = document.getElementById('applyDiscount');
    applyDiscountBtn.addEventListener('click', applyDiscountCode);
    
    const discountCodeInput = document.getElementById('discountCode');
    discountCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyDiscountCode();
        }
    });

    // Form submission
    const bookingForm = document.getElementById('customBookingForm');
    bookingForm.addEventListener('submit', handleFormSubmit);

    // Eco-camp selection
    setupEcoCampSelection();
}

function setupEcoCampSelection() {
    const ecoCampOptions = document.querySelectorAll('.eco-camp-option');
    const ecoCampInput = document.getElementById('selectedEcoCamp');
    
    if (!ecoCampOptions.length) return;

    ecoCampOptions.forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
            radio.addEventListener('change', () => {
                const campId = radio.value;
                const campName = option.querySelector('h4')?.textContent || campId;
                
                if (ecoCampInput) {
                    ecoCampInput.value = campId;
                }
                
                currentBooking.selectedEcoCamp = {
                    id: campId,
                    name: campName
                };
                
                if (typeof showNotification === 'function') {
                    showNotification(`${campName} selected!`, 'success');
                }
            });
        }
    });
}

function clearEcoCampSelection() {
    const ecoCampOptions = document.querySelectorAll('.eco-camp-option input[type="radio"]');
    const ecoCampInput = document.getElementById('selectedEcoCamp');
    
    ecoCampOptions.forEach(radio => {
        radio.checked = false;
    });
    
    if (ecoCampInput) {
        ecoCampInput.value = '';
    }
    
    currentBooking.selectedEcoCamp = null;
    
    if (typeof showNotification === 'function') {
        showNotification('Eco-Camp selection cleared', 'info');
    }
}

// ===================================
// PACKAGE HANDLING
// ===================================

function handlePackageChange(packageType) {
    currentBooking.packageType = packageType;
    
    const customSection = document.getElementById('customActivitiesSection');
    
    if (packageType === 'custom') {
        customSection.style.display = 'block';
        // Day activities are optional - users can select 1, 2, or 3 days
        document.querySelectorAll('[name^="day"][name$="Activity"]').forEach(input => {
            input.required = false;
        });
    } else {
        customSection.style.display = 'none';
        // Remove requirement for day activities
        document.querySelectorAll('[name^="day"][name$="Activity"]').forEach(input => {
            input.required = false;
        });
        // Reset day selections
        currentBooking.day1Activity = null;
        currentBooking.day2Activity = null;
        currentBooking.day3Activity = null;
    }
    
    updatePriceSummary();
}
// ===================================
// PRICE CALCULATION
// ===================================

function calculateBasePrice() {
    if (currentBooking.packageType === 'full') {
        return PRICES.packages.full;
    } else {
        // Calculate price based on selected days only
        let total = 0;
        if (currentBooking.day1Activity) {
            total += PRICES.packages[currentBooking.day1Activity];
        }
        if (currentBooking.day2Activity) {
            total += PRICES.packages[currentBooking.day2Activity];
        }
        if (currentBooking.day3Activity) {
            total += PRICES.packages[currentBooking.day3Activity];
        }
        return total;
    }
}

function calculateAddonsTotal() {
    return currentBooking.addons.reduce((sum, addon) => sum + addon.price, 0);
}

function calculateSubtotal() {
    const basePrice = calculateBasePrice();
    const addonsTotal = calculateAddonsTotal();
    return (basePrice + addonsTotal) * currentBooking.numberOfPeople;
}

function calculateDiscount(subtotal) {
    if (currentBooking.discountCode && PRICES.discounts[currentBooking.discountCode]) {
        const discountRate = PRICES.discounts[currentBooking.discountCode];
        return subtotal * discountRate;
    }
    return 0;
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    return subtotal - discount;
}

// ===================================
// UI UPDATE
// ===================================

function updatePriceSummary() {
    const basePrice = calculateBasePrice();
    const addonsTotal = calculateAddonsTotal();
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount(subtotal);
    const total = calculateTotal();
    
    // Update base price
    if (currentBooking.packageType === 'custom' && basePrice === 0) {
        document.getElementById('basePrice').textContent = 'Select days';
    } else {
        document.getElementById('basePrice').textContent = `₱${basePrice.toLocaleString()}`;
    }
    
    // Update activity breakdown for custom package
    const activityBreakdown = document.getElementById('activityBreakdown');
    if (currentBooking.packageType === 'custom') {
        let breakdownHTML = '';
        
        if (currentBooking.day1Activity) {
            const activityName = getActivityTypeName(currentBooking.day1Activity);
            breakdownHTML += `
                <div class="price-line" style="font-size: 0.9rem; opacity: 0.8;">
                    <span>Day 1 - ${activityName}:</span>
                    <span>₱${PRICES.packages[currentBooking.day1Activity].toLocaleString()}</span>
                </div>
            `;
        }
        if (currentBooking.day2Activity) {
            const activityName = getActivityTypeName(currentBooking.day2Activity);
            breakdownHTML += `
                <div class="price-line" style="font-size: 0.9rem; opacity: 0.8;">
                    <span>Day 2 - ${activityName}:</span>
                    <span>₱${PRICES.packages[currentBooking.day2Activity].toLocaleString()}</span>
                </div>
            `;
        }
        if (currentBooking.day3Activity) {
            const activityName = getActivityTypeName(currentBooking.day3Activity);
            breakdownHTML += `
                <div class="price-line" style="font-size: 0.9rem; opacity: 0.8;">
                    <span>Day 3 - ${activityName}:</span>
                    <span>₱${PRICES.packages[currentBooking.day3Activity].toLocaleString()}</span>
                </div>
            `;
        }
        
        activityBreakdown.innerHTML = breakdownHTML;
    } else {
        activityBreakdown.innerHTML = '';
    }
    
    // Update addons list
    const addonsList = document.getElementById('addonsList');
    if (currentBooking.addons.length > 0) {
        let addonsHTML = '';
        currentBooking.addons.forEach(addon => {
            addonsHTML += `
                <div class="price-line" style="font-size: 0.9rem; opacity: 0.8;">
                    <span>${getAddonName(addon.name)}:</span>
                    <span>₱${(addon.price * currentBooking.numberOfPeople).toLocaleString()}</span>
                </div>
            `;
        });
        addonsList.innerHTML = addonsHTML;
    } else {
        addonsList.innerHTML = '';
    }
    
    // Update people count
    document.getElementById('peopleCount').textContent = currentBooking.numberOfPeople;
    
    // Update subtotal
    if (currentBooking.packageType === 'custom' && subtotal === 0) {
        document.getElementById('subtotal').textContent = '₱0';
        document.getElementById('totalPrice').textContent = '₱0';
    } else {
        document.getElementById('subtotal').textContent = `₱${subtotal.toLocaleString()}`;
        
        // Update discount
        if (discount > 0) {
            document.getElementById('discountLine').style.display = 'flex';
            document.getElementById('discountAmount').textContent = `-₱${discount.toLocaleString()}`;
        } else {
            document.getElementById('discountLine').style.display = 'none';
        }
        
        // Update total
        document.getElementById('totalPrice').textContent = `₱${total.toLocaleString()}`;
    }
    
    // Update end date when price summary changes
    calculateEndDate();
}

// ===================================
// DISCOUNT CODE
// ===================================

function applyDiscountCode() {
    const discountCodeInput = document.getElementById('discountCode');
    const code = discountCodeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a discount code', 'error');
        return;
    }
    
    // Check for student discount eligibility
    if (code === 'STUDENT20') {
        const numberOfPeopleSelect = document.getElementById('numberOfPeople');
        const selectedValue = numberOfPeopleSelect.value;
        
        if (selectedValue !== '10+' && selectedValue !== '6-10' && parseInt(selectedValue) < 10) {
            showNotification('Student discount requires a group of 10+ people', 'error');
            return;
        }
    }
    
    if (PRICES.discounts[code]) {
        currentBooking.discountCode = code;
        document.getElementById('discountApplied').style.display = 'flex';
        showNotification(`Discount code "${code}" applied successfully!`, 'success');
        updatePriceSummary();
    } else {
        showNotification('Invalid discount code', 'error');
        currentBooking.discountCode = null;
        document.getElementById('discountApplied').style.display = 'none';
    }
}

// ===================================
// FORM SUBMISSION
// ===================================

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        personalInfo: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            numberOfPeople: formData.get('numberOfPeople')
        },
        tourDates: {
            startDate: formData.get('tourStartDate'),
            endDate: formData.get('tourEndDate')
        },
        package: {
            type: currentBooking.packageType,
            basePrice: calculateBasePrice()
        },
        activities: {},
        addons: currentBooking.addons,
        specialRequests: {
            dietary: formData.get('dietary'),
            accessibility: formData.get('accessibility')
        },
        payment: {
            method: formData.get('paymentMethod'),
            subtotal: calculateSubtotal(),
            discount: calculateDiscount(calculateSubtotal()),
            total: calculateTotal()
        },
        discountCode: currentBooking.discountCode,
        ecoCamp: currentBooking.selectedEcoCamp
    };
    
    // Add activity details for custom package
    if (currentBooking.packageType === 'custom') {
        // Check if at least one day is selected
        if (!currentBooking.day1Activity && !currentBooking.day2Activity && !currentBooking.day3Activity) {
            showNotification('Please select at least one day for your custom package', 'error');
            return;
        }
        
        // Only include selected days in the activities object
        bookingData.activities = {};
        
        if (currentBooking.day1Activity) {
            bookingData.activities.day1 = {
                type: currentBooking.day1Activity,
                price: PRICES.packages[currentBooking.day1Activity]
            };
        }
        
        if (currentBooking.day2Activity) {
            bookingData.activities.day2 = {
                type: currentBooking.day2Activity,
                price: PRICES.packages[currentBooking.day2Activity]
            };
        }
        
        if (currentBooking.day3Activity) {
            bookingData.activities.day3 = {
                type: currentBooking.day3Activity,
                price: PRICES.packages[currentBooking.day3Activity]
            };
        }
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.personalInfo.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Store booking data globally for success modal
    window.currentBookingData = bookingData;
    
    // Show loading screen
    showLoadingScreen();
    
    // Simulate processing (in real app, this would be an API call)
    setTimeout(() => {
        hideLoadingScreen();
        // Show confirmation modal
        showBookingConfirmationModal(bookingData);
    }, 2000);
}

// ===================================
// LOADING SCREEN
// ===================================

function showLoadingScreen() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner"></div>
        <div class="loading-text">Processing Your Booking...</div>
        <div class="loading-subtext">Please wait while we confirm your adventure</div>
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoadingScreen() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// ===================================
// CONFIRMATION MODAL
// ===================================

function showBookingConfirmationModal(bookingData) {
    // Remove any existing modals first
    const existingModals = document.querySelectorAll('.success-modal-overlay');
    existingModals.forEach(m => m.remove());
    
    const modal = document.createElement('div');
    modal.className = 'success-modal-overlay';
    modal.id = 'confirmationModal';
    
    let activitiesHTML = '';
    if (bookingData.package.type === 'full') {
        activitiesHTML = `
            <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">Full 3-Day Experience</span>
            </div>
        `;
    } else {
        // Only show selected days
        if (bookingData.activities.day1) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 1 Activity:</span>
                    <span class="detail-value">${getActivityTypeName(bookingData.activities.day1.type)} (₱${bookingData.activities.day1.price.toLocaleString()})</span>
                </div>
            `;
        }
        if (bookingData.activities.day2) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 2 Activity:</span>
                    <span class="detail-value">${getActivityTypeName(bookingData.activities.day2.type)} (₱${bookingData.activities.day2.price.toLocaleString()})</span>
                </div>
            `;
        }
        if (bookingData.activities.day3) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 3 Activity:</span>
                    <span class="detail-value">${getActivityTypeName(bookingData.activities.day3.type)} (₱${bookingData.activities.day3.price.toLocaleString()})</span>
                </div>
            `;
        }
        
        // Show package type summary
        const selectedDays = Object.keys(bookingData.activities).length;
        const dayText = selectedDays === 1 ? 'Day' : 'Days';
        activitiesHTML = `
            <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">Custom Package (${selectedDays} ${dayText})</span>
            </div>
        ` + activitiesHTML;
    }
    
    let addonsHTML = '';
    if (bookingData.addons.length > 0) {
        addonsHTML = '<div class="detail-row"><span class="detail-label">Add-ons:</span><span class="detail-value">';
        bookingData.addons.forEach(addon => {
            addonsHTML += `${getAddonName(addon.name)}, `;
        });
        addonsHTML = addonsHTML.slice(0, -2) + '</span></div>';
    }
    
    let discountHTML = '';
    if (bookingData.payment.discount > 0) {
        discountHTML = `
            <div class="detail-row" style="color: #4caf50;">
                <span class="detail-label">Discount (${bookingData.discountCode}):</span>
                <span class="detail-value">-₱${bookingData.payment.discount.toLocaleString()}</span>
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Booking Confirmation</h2>
            <p class="success-message">
                Please review your booking details below before confirming your payment.
            </p>
            
            <div class="success-details">
                <h3>Booking Summary</h3>
                <div class="success-detail-item">
                    <span class="success-detail-label">Name:</span>
                    <span class="success-detail-value">${bookingData.personalInfo.fullName}</span>
                </div>
                <div class="success-detail-item">
                    <span class="success-detail-label">Email:</span>
                    <span class="success-detail-value">${bookingData.personalInfo.email}</span>
                </div>
                <div class="success-detail-item">
                    <span class="success-detail-label">Phone:</span>
                    <span class="success-detail-value">${bookingData.personalInfo.phone}</span>
                </div>
                <div class="success-detail-item">
                    <span class="success-detail-label">People:</span>
                    <span class="success-detail-value">${bookingData.personalInfo.numberOfPeople}</span>
                </div>
                ${bookingData.tourDates && bookingData.tourDates.startDate ? `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Start Date:</span>
                        <span class="success-detail-value">${formatDate(bookingData.tourDates.startDate)}</span>
                    </div>
                ` : ''}
                ${bookingData.tourDates && bookingData.tourDates.endDate ? `
                    <div class="success-detail-item">
                        <span class="success-detail-label">End Date:</span>
                        <span class="success-detail-value">${formatDate(bookingData.tourDates.endDate)}</span>
                    </div>
                ` : ''}
                ${activitiesHTML}
                ${bookingData.specialRequests.dietary ? `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Dietary:</span>
                        <span class="success-detail-value">${bookingData.specialRequests.dietary}</span>
                    </div>
                ` : ''}
                ${bookingData.ecoCamp ? `
                    <div class="success-detail-item">
                        <span class="success-detail-label">Eco-Camp:</span>
                        <span class="success-detail-value">${bookingData.ecoCamp.name}</span>
                    </div>
                ` : ''}
                <div class="success-detail-item">
                    <span class="success-detail-label">Payment:</span>
                    <span class="success-detail-value">${getPaymentMethodName(bookingData.payment.method)}</span>
                </div>
                ${discountHTML ? `
                    <div class="success-detail-item" style="color: #4caf50;">
                        <span class="success-detail-label">Discount:</span>
                        <span class="success-detail-value">-₱${bookingData.payment.discount.toLocaleString()}</span>
                    </div>
                ` : ''}
                <div class="success-detail-item" style="border-top: 2px solid var(--primary-color); margin-top: 0.5rem; padding-top: 1rem; font-size: 1.2rem;">
                    <span class="success-detail-label">Total Amount:</span>
                    <span class="success-detail-value" style="color: var(--primary-color);">₱${bookingData.payment.total.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="success-actions">
                <button class="btn btn-secondary" onclick="closeConfirmationModal()">
                    <i class="fas fa-edit"></i> Edit Booking
                </button>
                <button class="btn btn-primary" onclick="confirmAndPayBooking()">
                    <i class="fas fa-check-circle"></i> Confirm & Pay
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store reference for later use
    window.currentConfirmationModal = modal;
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeConfirmationModal();
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeConfirmationModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// ===================================
// GLOBAL FUNCTIONS FOR MODAL
// ===================================

window.closeConfirmationModal = function() {
    // Remove by reference
    if (window.currentConfirmationModal) {
        window.currentConfirmationModal.remove();
        window.currentConfirmationModal = null;
    }
    
    // Remove by ID
    const modalById = document.getElementById('confirmationModal');
    if (modalById) {
        modalById.remove();
    }
    
    // Remove any confirmation modals by class
    const confirmModals = document.querySelectorAll('.success-modal-overlay');
    confirmModals.forEach(modal => {
        if (modal.id === 'confirmationModal' || modal.textContent.includes('Booking Confirmation')) {
            modal.remove();
        }
    });
};

window.confirmAndPayBooking = function() {
    // Close confirmation modal immediately
    closeConfirmationModal();
    
    // Small delay to ensure modal is removed
    setTimeout(() => {
        // Show loading screen
        showLoadingScreen();
        
        // Simulate payment processing
        setTimeout(() => {
            hideLoadingScreen();
            
            // Small delay before showing success
            setTimeout(() => {
                // Show success message
                showSuccessModal();
                
                // Reset form after a delay
                setTimeout(() => {
                    const form = document.getElementById('customBookingForm');
                    if (form) {
                        form.reset();
                    }
                    resetBooking();
                }, 1000);
            }, 100);
        }, 2500);
    }, 100);
};

// ===================================
// SUCCESS MODAL
// ===================================

function showSuccessModal() {
    // Remove ALL existing modals first
    const allModals = document.querySelectorAll('.success-modal-overlay, .booking-modal-overlay');
    allModals.forEach(m => m.remove());
    
    // Clear references
    window.currentConfirmationModal = null;
    window.currentSuccessModal = null;
    
    // Get booking data
    const bookingData = window.currentBookingData || {};
    
    // Build date HTML separately
    let dateHTML = '';
    if (bookingData.tourDates && bookingData.tourDates.startDate) {
        const startDateFormatted = formatDate(bookingData.tourDates.startDate);
        const endDateFormatted = bookingData.tourDates.endDate ? formatDate(bookingData.tourDates.endDate) : '';
        const dateRange = endDateFormatted ? startDateFormatted + ' - ' + endDateFormatted : startDateFormatted;
        
        dateHTML = `
            <div class="success-detail-item" style="margin-top: 1rem; padding: 0.8rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; border-left: 3px solid #4caf50;">
                <span class="success-detail-label" style="font-weight: 600; color: var(--primary-color);">
                    <i class="fas fa-calendar-check"></i> Tour Dates:
                </span>
                <span class="success-detail-value" style="color: var(--dark-color); font-weight: 600;">
                    ${dateRange}
                </span>
            </div>
        `;
    }
    
    const successModal = document.createElement('div');
    successModal.className = 'success-modal-overlay';
    successModal.id = 'successModal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Thank You for Booking!</h2>
            <p class="success-message" style="line-height: 1.8;">
                Thank you for booking your Eco-Trail experience! We can't wait to show you the natural wonders, local culture, and breathtaking man-made attractions of the North Highway District. Be sure to check your email for all the details you'll need to prepare for your adventure!
            </p>
            
            <div class="success-details">
                <h3><i class="fas fa-envelope"></i> Booking Confirmation</h3>
                ${dateHTML}
                <p style="color: var(--text-light); margin-top: 1rem; line-height: 1.8;">
                    Once the payment is successful, you will receive:
                </p>
                <ul style="text-align: left; color: var(--text-dark); margin-top: 0.5rem; padding-left: 2rem; line-height: 1.8;">
                    <li>A summary of your selected itinerary (Day 1, Day 2, Day 3 activities)</li>
                    <li>Booking details: Payment receipt, group size, and any special requests</li>
                    <li>Preparation Information: What to bring, where to meet, and eco-friendly tips for the tour</li>
                </ul>
            </div>
            
            <div style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); padding: 1.5rem; border-radius: 10px; margin-bottom: 1.5rem; color: white;">
                <p style="font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem;">
                    <i class="fas fa-share-alt"></i> Ready for your adventure?
                </p>
                <p style="font-size: 0.95rem; opacity: 0.95; line-height: 1.6;">
                    Share your excitement on social media and tag us using <strong>#NorthHighwayEcoTrail</strong> for a chance to win a free add-on activity!
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <a href="#" style="color: white; font-size: 1.5rem; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Share on Facebook">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="#" style="color: white; font-size: 1.5rem; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Share on Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" style="color: white; font-size: 1.5rem; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Share on Twitter">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" style="color: white; font-size: 1.5rem; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'" title="Share on WhatsApp">
                        <i class="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>
            
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeSuccessModal()">
                    <i class="fas fa-home"></i> Back to Home
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    window.currentSuccessModal = successModal;
    
    // Close on overlay click
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeSuccessModal();
        }
    });
    
    // Close on ESC key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeSuccessModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Show notification
    setTimeout(() => {
        showNotification('Booking confirmed! Check your email for details.', 'success');
    }, 500);
}

window.closeSuccessModal = function() {
    // Remove by reference
    if (window.currentSuccessModal) {
        window.currentSuccessModal.remove();
        window.currentSuccessModal = null;
    }
    
    // Remove by ID
    const modalById = document.getElementById('successModal');
    if (modalById) {
        modalById.remove();
    }
    
    // Remove any success modals by class
    const successModals = document.querySelectorAll('.success-modal-overlay');
    successModals.forEach(modal => {
        if (modal.id === 'successModal' || modal.textContent.includes('Booking Successful')) {
            modal.remove();
        }
    });
    
    // Clear all references
    window.currentConfirmationModal = null;
    window.currentSuccessModal = null;
    
    // Redirect to home page
    window.location.href = 'index.html';
};

// ===================================
// HELPER FUNCTIONS
// ===================================

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getAddonName(addonKey) {
    const names = {
        ecocamp: 'Eco-Camp Experience',
        night: 'Night Programs',
        food: 'Heritage Food Tasting',
        conservation: 'Conservation Activities'
    };
    return names[addonKey] || addonKey;
}

function getActivityTypeName(type) {
    const names = {
        natural: 'Natural Attractions',
        cultural: 'Cultural Attractions',
        manmade: 'Man-made Attractions'
    };
    return names[type] || capitalize(type);
}

function getPaymentMethodName(method) {
    const names = {
        card: 'Credit/Debit Card',
        paypal: 'PayPal',
        bank: 'Bank Transfer',
        cash: 'Cash on Arrival'
    };
    return names[method] || method;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function resetBooking() {
    currentBooking = {
        packageType: 'full',
        numberOfPeople: 1,
        day1Activity: null,
        day2Activity: null,
        day3Activity: null,
        addons: [],
        discountCode: null,
        discountAmount: 0,
        selectedEcoCamp: null
    };
    
    // Reset UI
    document.querySelectorAll('.activity-type-card, .activity-card-modal').forEach(card => {
        card.classList.remove('selected');
    });
    
    document.querySelectorAll('.addon-card, .addon-card-modal').forEach(card => {
        card.classList.remove('selected');
    });
    
    const discountCodeInput = document.getElementById('discountCode');
    const discountAppliedEl = document.getElementById('discountApplied');
    
    if (discountCodeInput) {
        discountCodeInput.value = '';
    }
    if (discountAppliedEl) {
        discountAppliedEl.style.display = 'none';
    }
    
    updatePriceSummary();
}

// Notification system (reuse from main site)
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Check screen size for responsive positioning
    const isMobile = window.innerWidth <= 768;
    const topPosition = isMobile ? '20px' : '100px';
    const rightPosition = isMobile ? '10px' : '20px';
    const leftPosition = isMobile ? '10px' : 'auto';
    const maxWidth = isMobile ? 'calc(100% - 20px)' : '400px';
    
    notification.style.cssText = `
        position: fixed;
        top: ${topPosition};
        right: ${rightPosition};
        ${isMobile ? `left: ${leftPosition};` : ''}
        background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 100000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
        max-width: ${maxWidth};
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
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
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c🌲 Booking System Loaded 🌲', 'color: #2d7a4f; font-size: 16px; font-weight: bold;');
console.log('%cReady to create personalized eco-adventures!', 'color: #52a679; font-size: 12px;');

