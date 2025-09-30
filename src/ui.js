export function showLoader() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <div class="loader-text">Loading Employee Enrollment System...</div>
        </div>
    `;
}

export function showWelcome(callback) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="welcome-screen">
            <h1 class="welcome-title">Welcome to Employee Enrollment System</h1>
            <p class="welcome-subtitle">Streamline your employee onboarding process</p>
            <button class="welcome-btn" id="getStartedBtn">Get Started</button>
        </div>
    `;

    document.getElementById('getStartedBtn').addEventListener('click', callback);
}

export function showMainApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="main-container">
            <div class="header">
                <h1 class="header-title">Employee Enrollment System</h1>
                <p class="header-subtitle">Complete the form below to enroll a new employee</p>
                <div class="nav-tabs">
                    <button class="nav-tab active" data-tab="enrollment">Enrollment Form</button>
                    <button class="nav-tab" data-tab="records">View Records</button>
                </div>
            </div>

            <div id="alert" class="alert"></div>

            <div id="enrollmentTab" class="tab-content active">
                <div class="card">
                    <h2 class="card-title">Employee Information</h2>
                    <form id="enrollmentForm" class="form-grid">
                        <div class="form-group">
                            <label class="form-label">First Name *</label>
                            <input type="text" name="firstName" class="form-input" required>
                            <div class="form-error">First name is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Last Name *</label>
                            <input type="text" name="lastName" class="form-input" required>
                            <div class="form-error">Last name is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <input type="email" name="email" class="form-input" required>
                            <div class="form-error">Valid email is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Phone *</label>
                            <input type="tel" name="phone" class="form-input" required>
                            <div class="form-error">Phone number is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Department *</label>
                            <select name="department" class="form-select" required>
                                <option value="">Select Department</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                                <option value="HR">Human Resources</option>
                                <option value="Finance">Finance</option>
                                <option value="Operations">Operations</option>
                            </select>
                            <div class="form-error">Department is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Position *</label>
                            <input type="text" name="position" class="form-input" required>
                            <div class="form-error">Position is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Start Date *</label>
                            <input type="date" name="startDate" class="form-input" required>
                            <div class="form-error">Start date is required</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Employee ID</label>
                            <input type="text" name="employeeId" class="form-input">
                        </div>

                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label">Address</label>
                            <textarea name="address" class="form-textarea"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">City</label>
                            <input type="text" name="city" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label">State</label>
                            <input type="text" name="state" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Zip Code</label>
                            <input type="text" name="zipCode" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Emergency Contact Name</label>
                            <input type="text" name="emergencyContactName" class="form-input">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Emergency Contact Phone</label>
                            <input type="tel" name="emergencyContactPhone" class="form-input">
                        </div>

                        <div class="camera-section">
                            <h3 class="card-title">Employee Photo</h3>
                            <div class="camera-buttons">
                                <button type="button" class="btn btn-primary" id="openCameraBtn">Open Camera</button>
                                <button type="button" class="btn btn-secondary" id="uploadPhotoBtn">Upload Photo</button>
                                <input type="file" id="photoFileInput" accept="image/*" class="hidden">
                            </div>

                            <div id="cameraContainer" class="camera-container">
                                <video id="cameraVideo" class="camera-video" autoplay></video>
                                <canvas id="cameraCanvas" class="camera-canvas"></canvas>
                                <div class="camera-buttons">
                                    <button type="button" class="btn btn-success" id="captureBtn">Capture Photo</button>
                                    <button type="button" class="btn btn-secondary" id="closeCameraBtn">Close Camera</button>
                                </div>
                            </div>

                            <img id="photoPreview" class="photo-preview" alt="Employee photo">
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" id="resetFormBtn">Reset Form</button>
                            <button type="submit" class="btn btn-primary">Submit Enrollment</button>
                        </div>
                    </form>
                </div>
            </div>

            <div id="recordsTab" class="tab-content">
                <div class="card">
                    <h2 class="card-title">Employee Records</h2>
                    <div class="search-bar">
                        <input type="text" id="searchInput" class="search-input" placeholder="Search by name, email, or department...">
                    </div>
                    <div id="recordsTableContainer"></div>
                </div>
            </div>
        </div>
    `;
}

export function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert alert-${type} show`;

    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

export function renderRecordsTable(records) {
    const container = document.getElementById('recordsTableContainer');

    if (records.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3 class="empty-state-title">No Records Found</h3>
                <p class="empty-state-text">Start by enrolling your first employee</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <table class="records-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Position</th>
                    <th>Start Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${records.map(record => `
                    <tr>
                        <td>${record.firstName} ${record.lastName}</td>
                        <td>${record.email}</td>
                        <td>${record.department}</td>
                        <td>${record.position}</td>
                        <td>${new Date(record.startDate).toLocaleDateString()}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-sm btn-primary view-record" data-id="${record.id}">View</button>
                                <button class="btn btn-sm btn-success download-pdf" data-id="${record.id}">PDF</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}