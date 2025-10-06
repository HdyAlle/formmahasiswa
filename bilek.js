// Data Program Studi berdasarkan Fakultas
const programStudi = {
    'Teknik': [
        'Teknik Informatika',
        'Teknik Elektro',
        'Teknik Mesin',
        'Teknik Sipil',
        'Teknik Industri',
        'Teknik Kimia',
        'Arsitektur'
    ],
    'Ekonomi': [
        'Manajemen',
        'Akuntansi',
        'Ekonomi Pembangunan',
        'Ekonomi Islam',
        'Bisnis Digital'
    ],
    'Hukum': [
        'Ilmu Hukum',
        'Hukum Bisnis',
        'Hukum Internasional'
    ],
    'Kedokteran': [
        'Pendidikan Dokter',
        'Kedokteran Gigi',
        'Farmasi',
        'Keperawatan',
        'Kebidanan'
    ],
    'MIPA': [
        'Matematika',
        'Fisika',
        'Kimia',
        'Biologi',
        'Statistika'
    ],
    'Sosial Politik': [
        'Ilmu Politik',
        'Ilmu Komunikasi',
        'Sosiologi',
        'Hubungan Internasional',
        'Administrasi Publik'
    ],
    'Psikologi': [
        'Psikologi'
    ]
};

// State aplikasi
let currentStep = 1;
const maxSteps = 3;
let formData = {};

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    updateProgramStudi();
});

// Inisialisasi form
function initializeForm() {
    showStep(1);
    updateNavigationButtons();
    generateFormValidation();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('nextBtn').addEventListener('click', nextStep);
    document.getElementById('prevBtn').addEventListener('click', prevStep);
    document.getElementById('submitBtn').addEventListener('click', submitForm);
    
    // Fakultas change event
    document.getElementById('fakultas').addEventListener('change', updateProgramStudi);
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
    
    // NPM validation
    document.getElementById('npm').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Phone validation
    document.getElementById('telepon').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Year validation
    document.getElementById('tahunLulus').addEventListener('input', function() {
        const currentYear = new Date().getFullYear();
        if (parseInt(this.value) > currentYear + 1) {
            this.value = currentYear + 1;
        }
    });
}

// Update program studi berdasarkan fakultas
function updateProgramStudi() {
    const fakultasSelect = document.getElementById('fakultas');
    const prodiSelect = document.getElementById('programStudi');
    
    // Clear existing options
    prodiSelect.innerHTML = '<option value="">Pilih Program Studi</option>';
    
    if (fakultasSelect.value && programStudi[fakultasSelect.value]) {
        programStudi[fakultasSelect.value].forEach(prodi => {
            const option = document.createElement('option');
            option.value = prodi;
            option.textContent = prodi;
            prodiSelect.appendChild(option);
        });
    }
}

// Navigasi step
function nextStep() {
    if (validateCurrentStep()) {
        saveCurrentStepData();
        
        if (currentStep < maxSteps) {
            currentStep++;
            showStep(currentStep);
            updateNavigationButtons();
            
            if (currentStep === 3) {
                displaySummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateNavigationButtons();
    }
}

// Tampilkan step tertentu
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update step indicator
    document.querySelectorAll('.step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        
        if (index + 1 === step) {
            stepEl.classList.add('active');
        } else if (index + 1 < step) {
            stepEl.classList.add('completed');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    // Previous button
    prevBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    
    // Next/Submit button
    if (currentStep === maxSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        submitBtn.style.display = 'none';
    }
}

// Validasi step saat ini
function validateCurrentStep() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepEl.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validasi field individual
function validateField(field) {
    const fieldContainer = field.closest('.form-group');
    const errorElement = fieldContainer.querySelector('.error-message');
    
    // Clear previous states
    fieldContainer.classList.remove('error', 'success');
    errorElement.textContent = '';
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Field ini wajib diisi';
    }
    
    // Specific validations
    if (field.value.trim()) {
        switch (field.type || field.tagName.toLowerCase()) {
            case 'email':
                if (!isValidEmail(field.value)) {
                    isValid = false;
                    errorMessage = 'Format email tidak valid';
                }
                break;
                
            case 'tel':
                if (!isValidPhone(field.value)) {
                    isValid = false;
                    errorMessage = 'Nomor telepon harus 10-13 digit';
                }
                break;
                
            case 'number':
                if (field.id === 'nilaiUn') {
                    const nilai = parseFloat(field.value);
                    if (nilai < 0 || nilai > 100) {
                        isValid = false;
                        errorMessage = 'Nilai harus antara 0 sampai 100';
                    }
                }
                break;
        }
        
        // NPM validation
        if (field.id === 'npm') {
            if (field.value.length !== 8) {
                isValid = false;
                errorMessage = 'NPM harus 8 digit';
            }
        }
        
        // Name validation
        if (field.id === 'namaLengkap') {
            if (field.value.length < 3) {
                isValid = false;
                errorMessage = 'Nama harus minimal 3 karakter';
            }
        }
    }
    
    // Agreement validation
    if (field.type === 'checkbox' && field.id === 'agreement') {
        if (!field.checked) {
            isValid = false;
            errorMessage = 'Anda harus menyetujui pernyataan ini';
        }
    }
    
    // Update UI
    if (isValid) {
        fieldContainer.classList.add('success');
    } else {
        fieldContainer.classList.add('error');
        errorElement.textContent = errorMessage;
    }
    
    return isValid;
}

// Clear error state
function clearError(field) {
    const fieldContainer = field.closest('.form-group');
    const errorElement = fieldContainer.querySelector('.error-message');
    
    if (fieldContainer.classList.contains('error')) {
        fieldContainer.classList.remove('error');
        errorElement.textContent = '';
    }
}

// Validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validasi nomor telepon
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,13}$/;
    return phoneRegex.test(phone);
}

// Simpan data step saat ini
function saveCurrentStepData() {
    const currentStepEl = document.getElementById(`step${currentStep}`);
    const inputs = currentStepEl.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else {
            formData[input.name] = input.value;
        }
    });
}

// Tampilkan ringkasan data
function displaySummary() {
    const summaryContainer = document.getElementById('dataSummary');
    
    const summaryData = [
        { label: 'Nama Lengkap', value: formData.namaLengkap },
        { label: 'NPM', value: formData.npm },
        { label: 'Tempat, Tanggal Lahir', value: `${formData.tempatLahir}, ${formatDate(formData.tanggalLahir)}` },
        { label: 'Jenis Kelamin', value: formData.jenisKelamin },
        { label: 'Agama', value: formData.agama },
        { label: 'Alamat', value: formData.alamat },
        { label: 'Email', value: formData.email },
        { label: 'No. Telepon', value: formData.telepon },
        { label: 'Asal Sekolah', value: formData.asalSekolah },
        { label: 'Jurusan Sekolah', value: formData.jurusan },
        { label: 'Tahun Lulus', value: formData.tahunLulus },
        { label: 'Nilai UN/Rata-rata', value: formData.nilaiUn },
        { label: 'Fakultas', value: formData.fakultas },
        { label: 'Program Studi', value: formData.programStudi },
        { label: 'Jalur Masuk', value: formData.jalurMasuk },
        { label: 'Gelombang', value: `Gelombang ${formData.gelombang}` }
    ];
    
    if (formData.motivasi) {
        summaryData.push({ label: 'Motivasi', value: formData.motivasi });
    }
    
    summaryContainer.innerHTML = summaryData.map(item => `
        <div class="summary-item">
            <span class="summary-label">${item.label}:</span>
            <span class="summary-value">${item.value}</span>
        </div>
    `).join('');
}

// Format tanggal
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Asia/Jakarta'
    };
    return date.toLocaleDateString('id-ID', options);
}

// Submit form
function submitForm(e) {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
        return;
    }
    
    saveCurrentStepData();
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Memproses...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate registration number
        const regNumber = generateRegistrationNumber();
        
        // Show success modal
        showSuccessModal(regNumber);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Log form data (in real app, send to server)
        console.log('Form Data:', formData);
        
    }, 2000);
}

// Generate nomor pendaftaran
function generateRegistrationNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `REG${year}${random}`;
}

// Show success modal
function showSuccessModal(regNumber) {
    const modal = document.getElementById('successModal');
    const regNumberElement = document.getElementById('regNumber');
    
    regNumberElement.textContent = regNumber;
    modal.classList.add('show');
    
    // Disable scroll
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    
    // Enable scroll
    document.body.style.overflow = 'auto';
    
    // Reset form
    resetForm();
}

// Reset form
function resetForm() {
    document.getElementById('registrationForm').reset();
    formData = {};
    currentStep = 1;
    showStep(1);
    updateNavigationButtons();
    updateProgramStudi();
    
    // Clear all validation states
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });
}

// Generate form validation
function generateFormValidation() {
    // Add real-time validation for better UX
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        // Add asterisk to required fields
        const label = input.closest('.form-group').querySelector('label');
        if (label && !label.textContent.includes('*')) {
            // Already has asterisk in HTML
        }
        
        // Add input event for real-time feedback
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                setTimeout(() => validateField(this), 300);
            }
        });
    });
}

// Handle keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.target.matches('textarea')) {
        e.preventDefault();
        
        if (currentStep < maxSteps) {
            nextStep();
        } else if (document.getElementById('submitBtn').style.display !== 'none') {
            submitForm(e);
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Adjust layout if needed
    if (window.innerWidth <= 768) {
        // Mobile adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
});

// Auto-save to localStorage (optional feature)
function autoSave() {
    saveCurrentStepData();
    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('currentStep', currentStep.toString());
}

// Load from localStorage (optional feature)
function loadSavedData() {
    const savedData = localStorage.getItem('formData');
    const savedStep = localStorage.getItem('currentStep');
    
    if (savedData) {
        try {
            formData = JSON.parse(savedData);
            
            // Populate form fields
            Object.keys(formData).forEach(key => {
                const field = document.querySelector(`[name="${key}"]`);
                if (field) {
                    if (field.type === 'checkbox') {
                        field.checked = formData[key];
                    } else {
                        field.value = formData[key];
                    }
                }
            });
            
            // Restore step
            if (savedStep) {
                currentStep = parseInt(savedStep);
                showStep(currentStep);
                updateNavigationButtons();
            }
            
            // Update program studi if fakultas is selected
            if (formData.fakultas) {
                updateProgramStudi();
                setTimeout(() => {
                    if (formData.programStudi) {
                        document.getElementById('programStudi').value = formData.programStudi;
                    }
                }, 100);
            }
            
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

// Clear saved data
function clearSavedData() {
    localStorage.removeItem('formData');
    localStorage.removeItem('currentStep');
}

// Initialize auto-save (uncomment to enable)
// setInterval(autoSave, 10000); // Auto-save every 10 seconds

// Load saved data on page load (uncomment to enable)
// document.addEventListener('DOMContentLoaded', loadSavedData);

// Clear saved data on successful submission
function onSubmissionSuccess() {
    clearSavedData();
}

// Utility function for debugging
function logFormData() {
    console.log('Current Form Data:', formData);
    console.log('Current Step:', currentStep);
}