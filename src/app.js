import { initializeCamera, getPhotoData, clearPhotoData, cleanupCamera } from './camera.js';
import { saveRecord, getAllRecords, searchRecords, getRecordById } from './database.js';
import { populateWordTemplate, generatePDF } from './documentProcessor.js';
import { showAlert, renderRecordsTable } from './ui.js';

export function initializeApp() {
    initializeTabs();
    initializeForm();
    initializeCamera();
    initializeRecords();
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            if (targetTab === 'enrollment') {
                document.getElementById('enrollmentTab').classList.add('active');
            } else if (targetTab === 'records') {
                document.getElementById('recordsTab').classList.add('active');
                loadRecords();
            }
        });
    });
}

function initializeForm() {
    const form = document.getElementById('enrollmentForm');
    const resetBtn = document.getElementById('resetFormBtn');

    form.addEventListener('submit', handleFormSubmit);
    resetBtn.addEventListener('click', resetForm);

    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');

    if (field.hasAttribute('required') && !field.value.trim()) {
        formGroup.classList.add('error');
        return false;
    }

    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('error');
            return false;
        }
    }

    formGroup.classList.remove('error');
    return true;
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    let isValid = true;
    form.querySelectorAll('input[required], select[required]').forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showAlert('Please fill in all required fields correctly', 'error');
        return;
    }

    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position'),
        startDate: formData.get('startDate'),
        employeeId: formData.get('employeeId') || '',
        address: formData.get('address') || '',
        city: formData.get('city') || '',
        state: formData.get('state') || '',
        zipCode: formData.get('zipCode') || '',
        emergencyContactName: formData.get('emergencyContactName') || '',
        emergencyContactPhone: formData.get('emergencyContactPhone') || '',
        photoData: getPhotoData() || ''
    };

    try {
        const savedRecord = saveRecord(data);
        showAlert('Enrollment submitted successfully!', 'success');

        const userChoice = confirm('Would you like to generate and download a PDF of this enrollment?');
        if (userChoice) {
            await generatePDF(data);
            showAlert('PDF generated successfully!', 'success');
        }

        resetForm();
    } catch (error) {
        console.error('Submission error:', error);
        showAlert('Failed to submit enrollment: ' + error.message, 'error');
    }
}

function resetForm() {
    const form = document.getElementById('enrollmentForm');
    form.reset();

    form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });

    clearPhotoData();
    cleanupCamera();

    showAlert('Form has been reset', 'success');
}

function initializeRecords() {
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query) {
            const results = searchRecords(query);
            renderRecordsTable(results);
        } else {
            loadRecords();
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-record')) {
            const id = e.target.dataset.id;
            viewRecord(id);
        } else if (e.target.classList.contains('download-pdf')) {
            const id = e.target.dataset.id;
            downloadRecordPDF(id);
        }
    });
}

function loadRecords() {
    const records = getAllRecords();
    renderRecordsTable(records);
}

function viewRecord(id) {
    const record = getRecordById(id);
    if (!record) {
        showAlert('Record not found', 'error');
        return;
    }

    const details = `
        Name: ${record.firstName} ${record.lastName}
        Email: ${record.email}
        Phone: ${record.phone}
        Department: ${record.department}
        Position: ${record.position}
        Start Date: ${new Date(record.startDate).toLocaleDateString()}
        ${record.address ? '\nAddress: ' + record.address : ''}
        ${record.city ? '\nCity: ' + record.city : ''}
        ${record.state ? '\nState: ' + record.state : ''}
        ${record.zipCode ? '\nZip Code: ' + record.zipCode : ''}
        ${record.emergencyContactName ? '\nEmergency Contact: ' + record.emergencyContactName : ''}
        ${record.emergencyContactPhone ? '\nEmergency Phone: ' + record.emergencyContactPhone : ''}
    `;

    alert('Employee Details:\n\n' + details);
}

async function downloadRecordPDF(id) {
    const record = getRecordById(id);
    if (!record) {
        showAlert('Record not found', 'error');
        return;
    }

    try {
        await generatePDF(record);
        showAlert('PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showAlert('Failed to generate PDF: ' + error.message, 'error');
    }
}