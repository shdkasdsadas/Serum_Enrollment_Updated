const DB_KEY = 'employeeEnrollmentDB';

function initializeDB() {
    if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
}

export function saveRecord(record) {
    initializeDB();
    const db = JSON.parse(localStorage.getItem(DB_KEY));

    const newRecord = {
        id: generateId(),
        ...record,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.push(newRecord);
    localStorage.setItem(DB_KEY, JSON.stringify(db));

    return newRecord;
}

export function getAllRecords() {
    initializeDB();
    return JSON.parse(localStorage.getItem(DB_KEY));
}

export function getRecordById(id) {
    const db = getAllRecords();
    return db.find(record => record.id === id);
}

export function searchRecords(query) {
    const db = getAllRecords();
    const lowerQuery = query.toLowerCase();

    return db.filter(record =>
        record.firstName.toLowerCase().includes(lowerQuery) ||
        record.lastName.toLowerCase().includes(lowerQuery) ||
        record.email.toLowerCase().includes(lowerQuery) ||
        record.department.toLowerCase().includes(lowerQuery) ||
        record.position.toLowerCase().includes(lowerQuery)
    );
}

export function deleteRecord(id) {
    const db = getAllRecords();
    const filtered = db.filter(record => record.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(filtered));
}

export function updateRecord(id, updates) {
    const db = getAllRecords();
    const index = db.findIndex(record => record.id === id);

    if (index !== -1) {
        db[index] = {
            ...db[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        return db[index];
    }

    return null;
}

function generateId() {
    return 'emp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}