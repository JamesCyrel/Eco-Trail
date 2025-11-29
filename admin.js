// Admin Dashboard JavaScript

// Static booking data
const staticBookings = [
    {
        id: 'ET-2025-001',
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '+63 912 345 6789',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        guests: 4,
        totalAmount: 18000,
        status: 'confirmed',
        ecoCamp: 'Sabangan Eco-Camp',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Tribu Cabin',
        addons: ['Eco-Camp Experience', 'Heritage Food Tasting'],
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ET-2025-002',
        name: 'John Rivera',
        email: 'john.rivera@email.com',
        phone: '+63 923 456 7890',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-03-20',
        endDate: '2025-03-21',
        guests: 2,
        totalAmount: 3700,
        status: 'pending',
        day1Activity: 'Natural Attractions',
        day2Activity: 'Cultural Attractions',
        sunsetView: 'Earth Sky View',
        farmVisit: 'Candiisan Diversified Farm',
        addons: ['Night Programs'],
        paymentMethod: 'PayPal'
    },
    {
        id: 'ET-2025-003',
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        phone: '+63 934 567 8901',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-02-28',
        endDate: '2025-03-02',
        guests: 6,
        totalAmount: 27000,
        status: 'completed',
        ecoCamp: 'Misty Mountain Eco-Camp',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Ohana Resort',
        addons: ['Eco-Camp Experience', 'Heritage Food Tasting', 'Conservation Activities'],
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'ET-2025-004',
        name: 'Michael Torres',
        email: 'michael.torres@email.com',
        phone: '+63 945 678 9012',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-04-05',
        endDate: '2025-04-07',
        guests: 3,
        totalAmount: 5550,
        status: 'confirmed',
        day1Activity: 'Natural Attractions',
        day2Activity: 'Cultural Attractions',
        day3Activity: 'Man-made Attractions',
        sunsetView: 'Earth Sky View',
        farmVisit: 'Candiisan Diversified Farm',
        resort: 'Casa de Vera Resort',
        addons: [],
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ET-2025-005',
        name: 'Lisa Garcia',
        email: 'lisa.garcia@email.com',
        phone: '+63 956 789 0123',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-03-10',
        endDate: '2025-03-12',
        guests: 5,
        totalAmount: 22500,
        status: 'confirmed',
        ecoCamp: 'Katihan Eco-Camp',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Tribu Cabin',
        addons: ['Eco-Camp Experience', 'Night Programs'],
        paymentMethod: 'Cash on Arrival'
    },
    {
        id: 'ET-2025-006',
        name: 'David Martinez',
        email: 'david.martinez@email.com',
        phone: '+63 967 890 1234',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-04-15',
        endDate: '2025-04-16',
        guests: 2,
        totalAmount: 2600,
        status: 'pending',
        day1Activity: 'Man-made Attractions',
        day2Activity: 'Natural Attractions',
        sunsetView: 'Earth Sky View',
        farmVisit: 'Candiisan Diversified Farm',
        addons: ['Heritage Food Tasting'],
        paymentMethod: 'PayPal'
    },
    {
        id: 'ET-2025-007',
        name: 'Jennifer Lee',
        email: 'jennifer.lee@email.com',
        phone: '+63 978 901 2345',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-02-20',
        endDate: '2025-02-22',
        guests: 8,
        totalAmount: 36000,
        status: 'completed',
        ecoCamp: 'Sabangan Eco-Camp',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Ohana Resort',
        addons: ['Eco-Camp Experience', 'Heritage Food Tasting', 'Conservation Activities', 'Night Programs'],
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'ET-2025-008',
        name: 'Robert Wilson',
        email: 'robert.wilson@email.com',
        phone: '+63 989 012 3456',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-04-20',
        endDate: '2025-04-22',
        guests: 4,
        totalAmount: 7400,
        status: 'confirmed',
        day1Activity: 'Cultural Attractions',
        day2Activity: 'Natural Attractions',
        day3Activity: 'Man-made Attractions',
        sunsetView: 'Earth Sky View',
        farmVisit: 'Candiisan Diversified Farm',
        resort: 'Casa de Vera Resort',
        addons: ['Eco-Camp Experience'],
        paymentMethod: 'Credit Card'
    },
    {
        id: 'ET-2025-009',
        name: 'Amanda Brown',
        email: 'amanda.brown@email.com',
        phone: '+63 990 123 4567',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-03-25',
        endDate: '2025-03-27',
        guests: 3,
        totalAmount: 13500,
        status: 'confirmed',
        ecoCamp: 'Misty Mountain Eco-Camp',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Tribu Cabin',
        addons: ['Heritage Food Tasting'],
        paymentMethod: 'PayPal'
    },
    {
        id: 'ET-2025-010',
        name: 'James Anderson',
        email: 'james.anderson@email.com',
        phone: '+63 901 234 5678',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-05-01',
        endDate: '2025-05-01',
        guests: 1,
        totalAmount: 1500,
        status: 'pending',
        day1Activity: 'Natural Attractions',
        sunsetView: 'Can-ayan View Deck',
        addons: [],
        paymentMethod: 'Cash on Arrival'
    },
    {
        id: 'ET-2025-011',
        name: 'Patricia Taylor',
        email: 'patricia.taylor@email.com',
        phone: '+63 912 345 6789',
        package: 'Full 3-Day Package',
        packageType: 'full',
        startDate: '2025-02-15',
        endDate: '2025-02-17',
        guests: 10,
        totalAmount: 45000,
        status: 'completed',
        ecoCamp: 'Katihan Eco-Camp',
        sunsetView: 'Earth Sky View',
        farmVisit: 'Candiisan Diversified Farm',
        resort: 'Ohana Resort',
        addons: ['Eco-Camp Experience', 'Heritage Food Tasting', 'Conservation Activities', 'Night Programs'],
        paymentMethod: 'Bank Transfer'
    },
    {
        id: 'ET-2025-012',
        name: 'Christopher Moore',
        email: 'christopher.moore@email.com',
        phone: '+63 923 456 7890',
        package: 'Custom Selection',
        packageType: 'custom',
        startDate: '2025-04-10',
        endDate: '2025-04-12',
        guests: 6,
        totalAmount: 11100,
        status: 'confirmed',
        day1Activity: 'Natural Attractions',
        day2Activity: 'Cultural Attractions',
        day3Activity: 'Man-made Attractions',
        sunsetView: 'Can-ayan View Deck',
        farmVisit: 'Mt. Kitanglad Agri-Tourism Farm',
        resort: 'Casa de Vera Resort',
        addons: ['Eco-Camp Experience', 'Heritage Food Tasting'],
        paymentMethod: 'Credit Card'
    }
];

let filteredBookings = [...staticBookings];

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    renderBookings();
    setupFilters();
    updateStats();
});

// Render bookings table
function renderBookings() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;

    if (filteredBookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 3rem; color: var(--text-light);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>No bookings found matching your criteria.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredBookings.map(booking => {
        const statusClass = `status-${booking.status}`;
        const dateRange = booking.endDate 
            ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
            : formatDate(booking.startDate);

        return `
            <tr>
                <td><span class="booking-id">${booking.id}</span></td>
                <td>${booking.name}</td>
                <td>${booking.email}</td>
                <td>${booking.phone}</td>
                <td><span class="package-badge">${booking.package}</span></td>
                <td>${dateRange}</td>
                <td>${booking.guests}</td>
                <td><strong>₱${booking.totalAmount.toLocaleString()}</strong></td>
                <td><span class="status-badge ${statusClass}">${booking.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-view" onclick="viewBookingDetails('${booking.id}')">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const packageFilter = document.getElementById('packageFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    if (packageFilter) {
        packageFilter.addEventListener('change', applyFilters);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const packageType = document.getElementById('packageFilter').value;
    const status = document.getElementById('statusFilter').value;

    filteredBookings = staticBookings.filter(booking => {
        const matchesSearch = 
            booking.name.toLowerCase().includes(searchTerm) ||
            booking.email.toLowerCase().includes(searchTerm) ||
            booking.id.toLowerCase().includes(searchTerm);
        
        const matchesPackage = packageType === 'all' || booking.packageType === packageType;
        const matchesStatus = status === 'all' || booking.status === status;

        return matchesSearch && matchesPackage && matchesStatus;
    });

    renderBookings();
    updateStats();
}

// Update statistics
function updateStats() {
    const totalBookings = filteredBookings.length;
    const totalGuests = filteredBookings.reduce((sum, booking) => sum + booking.guests, 0);
    const fullPackages = filteredBookings.filter(b => b.packageType === 'full').length;

    document.getElementById('totalBookings').textContent = totalBookings;
    document.getElementById('totalGuests').textContent = totalGuests;
}

// View booking details
function viewBookingDetails(bookingId) {
    const booking = staticBookings.find(b => b.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('bookingDetailsModal');
    const content = document.getElementById('bookingDetailsContent');

    const dateRange = booking.endDate 
        ? `${formatDate(booking.startDate)} - ${formatDate(booking.endDate)}`
        : formatDate(booking.startDate);

    let activitiesHTML = '';
    if (booking.packageType === 'full') {
        activitiesHTML = `
            <div class="detail-row">
                <span class="detail-label">Day 1:</span>
                <span class="detail-value">Natural Attractions</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Day 2:</span>
                <span class="detail-value">Cultural Attractions</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Day 3:</span>
                <span class="detail-value">Man-made Attractions</span>
            </div>
        `;
    } else {
        if (booking.day1Activity) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 1:</span>
                    <span class="detail-value">${booking.day1Activity}</span>
                </div>
            `;
        }
        if (booking.day2Activity) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 2:</span>
                    <span class="detail-value">${booking.day2Activity}</span>
                </div>
            `;
        }
        if (booking.day3Activity) {
            activitiesHTML += `
                <div class="detail-row">
                    <span class="detail-label">Day 3:</span>
                    <span class="detail-value">${booking.day3Activity}</span>
                </div>
            `;
        }
    }

    let selectionsHTML = '';
    if (booking.ecoCamp) {
        selectionsHTML += `
            <div class="detail-row">
                <span class="detail-label">Eco-Camp:</span>
                <span class="detail-value">${booking.ecoCamp}</span>
            </div>
        `;
    }
    if (booking.sunsetView) {
        selectionsHTML += `
            <div class="detail-row">
                <span class="detail-label">Sunset View:</span>
                <span class="detail-value">${booking.sunsetView}</span>
            </div>
        `;
    }
    if (booking.farmVisit) {
        selectionsHTML += `
            <div class="detail-row">
                <span class="detail-label">Farm Visit:</span>
                <span class="detail-value">${booking.farmVisit}</span>
            </div>
        `;
    }
    if (booking.resort) {
        selectionsHTML += `
            <div class="detail-row">
                <span class="detail-label">Resort:</span>
                <span class="detail-value">${booking.resort}</span>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="detail-section">
            <h3><i class="fas fa-user"></i> Guest Information</h3>
            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value"><strong>${booking.id}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${booking.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${booking.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${booking.phone}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-calendar"></i> Booking Details</h3>
            <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value"><span class="package-badge">${booking.package}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Tour Dates:</span>
                <span class="detail-value">${dateRange}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Number of Guests:</span>
                <span class="detail-value">${booking.guests}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status-badge status-${booking.status}">${booking.status}</span></span>
            </div>
        </div>

        <div class="detail-section">
            <h3><i class="fas fa-map-marked-alt"></i> Activities</h3>
            ${activitiesHTML}
        </div>

        ${selectionsHTML ? `
        <div class="detail-section">
            <h3><i class="fas fa-check-circle"></i> Selections</h3>
            ${selectionsHTML}
        </div>
        ` : ''}

        ${booking.addons && booking.addons.length > 0 ? `
        <div class="detail-section">
            <h3><i class="fas fa-plus-circle"></i> Add-ons</h3>
            <div class="detail-row">
                <span class="detail-label">Selected:</span>
                <span class="detail-value">${booking.addons.join(', ')}</span>
            </div>
        </div>
        ` : ''}

        <div class="detail-section">
            <h3><i class="fas fa-credit-card"></i> Payment</h3>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">${booking.paymentMethod}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value"><strong style="font-size: 1.2rem; color: var(--primary-color);">₱${booking.totalAmount.toLocaleString()}</strong></span>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('bookingDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingDetailsModal');
    if (modal && e.target === modal) {
        closeBookingModal();
    }
});

// Close modal with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeBookingModal();
    }
});

