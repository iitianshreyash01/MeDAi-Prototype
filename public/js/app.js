
// MEDAi Prototype - Frontend JavaScript
const API_BASE = 'http://localhost:3000/api';

// State management
let currentUser = null;
let doctors = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadDoctors();
    setupDateInput();
});

// Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Show requested page
    const pageId = pageName + '-page';
    const page = document.getElementById(pageId);
    if (page) {
        page.style.display = 'block';
    }

    // If not authenticated, show auth page
    if (!currentUser && pageName !== 'dashboard') {
        document.getElementById('auth-page').style.display = 'block';
        alert('Please login first');
        return;
    }
}

// Toggle Auth Form
function toggleAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Register
function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!name || !email || !password) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    fetch(API_BASE + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName: name })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            showAlert('Registration successful!', 'success');
            document.getElementById('user-name').textContent = currentUser.name;
            document.getElementById('auth-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'block';
        } else {
            showAlert(data.error || 'Registration failed', 'error');
        }
    })
    .catch(err => showAlert('Error: ' + err.message, 'error'));
}

// Login
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    fetch(API_BASE + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentUser = data.user;
            showAlert('Login successful!', 'success');
            document.getElementById('user-name').textContent = currentUser.name;
            document.getElementById('auth-page').style.display = 'none';
            document.getElementById('dashboard-page').style.display = 'block';
        } else {
            showAlert(data.error || 'Login failed', 'error');
        }
    })
    .catch(err => showAlert('Error: ' + err.message, 'error'));
}

// Logout
function logout() {
    currentUser = null;
    document.getElementById('auth-page').style.display = 'block';
    document.getElementById('dashboard-page').style.display = 'none';
    document.getElementById('symptoms-page').style.display = 'none';
    document.getElementById('doctors-page').style.display = 'none';
    document.getElementById('medicines-page').style.display = 'none';
    document.getElementById('appointments-page').style.display = 'none';
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    showAlert('Logged out successfully', 'success');
}

// Symptoms Analysis
function analyzeSymptoms() {
    const symptoms = document.getElementById('symptoms-input').value
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

    if (symptoms.length === 0) {
        showAlert('Please enter at least one symptom', 'error');
        return;
    }

    const severity = document.getElementById('severity-select').value;
    const duration = document.getElementById('duration-select').value;

    showLoading();

    fetch(API_BASE + '/disease/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, severity, duration })
    })
    .then(res => res.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            displayAnalysisResult(data.analysis);
        } else {
            showAlert(data.error || 'Analysis failed', 'error');
        }
    })
    .catch(err => {
        hideLoading();
        showAlert('Error: ' + err.message, 'error');
    });
}

function displayAnalysisResult(analysis) {
    let html = '<div class="result-box">';
    html += '<h3>Analysis Result</h3>';
    html += '<p><strong>Symptoms:</strong> ' + analysis.symptoms.join(', ') + '</p>';
    html += '<p><strong>Possible Condition:</strong> ' + analysis.possibleCondition + '</p>';
    html += '<p><strong>Severity:</strong> <span class="severity">' + analysis.severity + '</span></p>';
    html += '</div>';

    html += '<div class="card">';
    html += '<h3>Recommendations</h3>';
    html += '<ul>';
    analysis.recommendations.forEach(rec => {
        html += '<li>✓ ' + rec + '</li>';
    });
    html += '</ul>';
    html += '</div>';

    if (analysis.suggestedDoctors && analysis.suggestedDoctors.length > 0) {
        html += '<div class="card">';
        html += '<h3>Suggested Doctors</h3>';
        analysis.suggestedDoctors.forEach(doc => {
            if (doc) {
                html += '<div class="doctor-item">';
                html += '<h4>' + doc.name + '</h4>';
                html += '<p>Specialty: ' + doc.specialty + '</p>';
                html += '<p>Fee: ₹' + doc.fee + '</p>';
                html += '<button onclick="bookFromDoctor(' + doc.id + ')" class="btn btn-primary">Book Appointment</button>';
                html += '</div>';
            }
        });
        html += '</div>';
    }

    document.getElementById('analysis-result').innerHTML = html;
}

function quickSymptom(symptoms) {
    document.getElementById('symptoms-input').value = symptoms;
    analyzeSymptoms();
}

// Doctors
function loadDoctors() {
    fetch(API_BASE + '/doctors')
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                doctors = data.doctors;
                populateDoctorSelect();
            }
        });
}

function populateDoctorSelect() {
    const select = document.getElementById('doctor-select');
    select.innerHTML = '<option value="">Choose a doctor...</option>';
    doctors.forEach(doc => {
        select.innerHTML += '<option value="' + doc.id + '">' + doc.name + ' - ' + doc.specialty + '</option>';
    });
}

function selectSpecialty(specialty) {
    let html = '<div class="card"><h3>Available Doctors - ' + specialty + '</h3>';

    doctors.forEach(doc => {
        if (doc.specialty.toLowerCase() === specialty) {
            html += '<div class="doctor-item">';
            html += '<h4>' + doc.name + '</h4>';
            html += '<p>Specialty: ' + doc.specialty + '</p>';
            html += '<p>Consultation Fee: ₹' + doc.fee + '</p>';
            html += '<button onclick="bookFromDoctor(' + doc.id + ')" class="btn btn-primary">Book Now</button>';
            html += '</div>';
        }
    });

    html += '</div>';
    document.getElementById('doctors-list').innerHTML = html;
}

// Medicines
function comparePrices() {
    const name = document.getElementById('medicine-name').value;
    const strength = document.getElementById('medicine-strength').value;

    if (!name || !strength) {
        showAlert('Please enter medicine name and strength', 'error');
        return;
    }

    showLoading();

    fetch(API_BASE + '/medicine/compare-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName: name, strength })
    })
    .then(res => res.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            displayPriceComparison(data.medicine);
        } else {
            showAlert(data.error || 'Medicine not found', 'error');
        }
    })
    .catch(err => {
        hideLoading();
        showAlert('Error: ' + err.message, 'error');
    });
}

function displayPriceComparison(medicine) {
    let html = '<div class="medicine-card">';
    html += '<div class="medicine-header">';
    html += '<h3>' + medicine.name + ' - ' + medicine.strength + '</h3>';
    html += '<span class="price-tag">₹' + medicine.cheapestOption.price + '</span>';
    html += '</div>';

    html += '<div class="price-list">';
    medicine.priceComparison.forEach(item => {
        html += '<div class="price-item">';
        html += '<div class="price-item-platform">' + item.platform + '</div>';
        html += '<div class="price-item-price">₹' + item.price + '</div>';
        html += '<div style="font-size:0.9rem;color:#4CAF50;">Save ' + item.discount + '%</div>';
        html += '<button class="btn btn-primary" style="width:100%;margin-top:0.5rem;">Buy Now</button>';
        html += '</div>';
    });
    html += '</div>';
    html += '</div>';

    document.getElementById('price-comparison').innerHTML = html;
}

function quickMedicine(name, strength) {
    document.getElementById('medicine-name').value = name;
    document.getElementById('medicine-strength').value = strength;
    comparePrices();
}

// Appointments
function bookFromDoctor(doctorId) {
    showPage('appointments');
    document.getElementById('doctor-select').value = doctorId;
}

function setupDateInput() {
    const dateInput = document.getElementById('appointment-date');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function bookAppointment() {
    const doctorId = document.getElementById('doctor-select').value;
    const date = document.getElementById('appointment-date').value;
    const time = document.getElementById('appointment-time').value;

    if (!doctorId || !date || !time) {
        showAlert('Please fill all fields', 'error');
        return;
    }

    showLoading();

    fetch(API_BASE + '/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: currentUser.id,
            doctorId: parseInt(doctorId),
            date,
            time
        })
    })
    .then(res => res.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            showAlert('Appointment booked successfully!', 'success');
            document.getElementById('appointment-date').value = '';
            document.getElementById('appointment-time').value = '';
            loadAppointments();
        } else {
            showAlert(data.error || 'Booking failed', 'error');
        }
    })
    .catch(err => {
        hideLoading();
        showAlert('Error: ' + err.message, 'error');
    });
}

function loadAppointments() {
    // In prototype, just show a success message
    let html = '<div class="card">';
    html += '<h3>Your Appointments</h3>';
    html += '<p>✓ You have successfully booked an appointment</p>';
    html += '</div>';
    document.getElementById('appointments-list').innerHTML = html;
}

// Utilities
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-' + type;
    alertDiv.textContent = message;

    const mainContent = document.getElementById('main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    setTimeout(() => alertDiv.remove(), 5000);
}

function showLoading() {
    document.body.style.opacity = '0.7';
}

function hideLoading() {
    document.body.style.opacity = '1';
}
