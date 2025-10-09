// [FE2-04] Borrow Records Page - API Integration

// API Configuration
const API_BASE_URL = 'http://localhost:3000/api/borrow';

// State management
let allRecords = [];
let filteredRecords = [];

// DOM Elements
const recordsTableBody = document.getElementById('recordsTableBody');
const filterUserInput = document.getElementById('filterUser');
const filterStatusSelect = document.getElementById('filterStatus');
const applyFilterBtn = document.getElementById('applyFilterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const userIdInput = document.getElementById('userIdInput');
const viewUserRecordsBtn = document.getElementById('viewUserRecordsBtn');
const userRecordsResult = document.getElementById('userRecordsResult');
const userRecordsTitle = document.getElementById('userRecordsTitle');
const userRecordsTableBody = document.getElementById('userRecordsTableBody');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadAllRecords();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    applyFilterBtn.addEventListener('click', applyFilters);
    clearFilterBtn.addEventListener('click', clearFilters);
    viewUserRecordsBtn.addEventListener('click', viewUserRecords);
    
    // Enter key support
    filterUserInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') applyFilters();
    });
    
    userIdInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') viewUserRecords();
    });
}

// [FE2-04] Load all borrow records
async function loadAllRecords() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch records');
        
        allRecords = await response.json();
        filteredRecords = [...allRecords];
        renderRecords(filteredRecords);
    } catch (error) {
        console.error('Error loading records:', error);
        showAlert('Error loading records. Using demo data.', 'error');
        // Demo data for testing without backend
        allRecords = [
            {
                id: 1,
                userId: 101,
                bookId: 1,
                bookTitle: 'The Great Gatsby',
                borrowDate: '2025-10-01',
                returnDate: '2025-10-08',
                status: 'returned'
            },
            {
                id: 2,
                userId: 102,
                bookId: 2,
                bookTitle: '1984',
                borrowDate: '2025-10-05',
                returnDate: null,
                status: 'borrowed'
            },
            {
                id: 3,
                userId: 101,
                bookId: 3,
                bookTitle: 'To Kill a Mockingbird',
                borrowDate: '2025-10-03',
                returnDate: null,
                status: 'borrowed'
            },
            {
                id: 4,
                userId: 103,
                bookId: 1,
                bookTitle: 'The Great Gatsby',
                borrowDate: '2025-09-20',
                returnDate: '2025-09-27',
                status: 'returned'
            }
        ];
        filteredRecords = [...allRecords];
        renderRecords(filteredRecords);
    }
}

// [FE2-04] Apply filters
function applyFilters() {
    const userIdFilter = filterUserInput.value.trim();
    const statusFilter = filterStatusSelect.value;
    
    filteredRecords = allRecords.filter(record => {
        let matchesUser = true;
        let matchesStatus = true;
        
        if (userIdFilter) {
            matchesUser = record.userId.toString() === userIdFilter;
        }
        
        if (statusFilter) {
            matchesStatus = record.status === statusFilter;
        }
        
        return matchesUser && matchesStatus;
    });
    
    renderRecords(filteredRecords);
}

// Clear filters
function clearFilters() {
    filterUserInput.value = '';
    filterStatusSelect.value = '';
    filteredRecords = [...allRecords];
    renderRecords(filteredRecords);
}

// [FE2-04] View specific user's borrow history
async function viewUserRecords() {
    const userId = userIdInput.value.trim();
    
    if (!userId) {
        showAlert('Please enter a User ID', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user records');
        
        const userRecords = await response.json();
        renderUserRecords(userId, userRecords);
    } catch (error) {
        console.error('Error loading user records:', error);
        // Demo mode: filter from local data
        const userRecords = allRecords.filter(record => record.userId.toString() === userId);
        renderUserRecords(userId, userRecords);
    }
}

// [FE2-04] Render all records in table
function renderRecords(records) {
    if (records.length === 0) {
        recordsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No records found.</td>
            </tr>
        `;
        return;
    }
    
    recordsTableBody.innerHTML = records.map(record => `
        <tr>
            <td>${record.id}</td>
            <td>${record.userId}</td>
            <td>${record.bookId}</td>
            <td>${escapeHtml(record.bookTitle || 'N/A')}</td>
            <td>${formatDate(record.borrowDate)}</td>
            <td>${record.returnDate ? formatDate(record.returnDate) : 'Not returned'}</td>
            <td>
                <span class="status-badge status-${record.status}">
                    ${record.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// [FE2-04] Render user-specific records
function renderUserRecords(userId, records) {
    userRecordsTitle.textContent = `Borrow History for User ID: ${userId}`;
    
    if (records.length === 0) {
        userRecordsTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No records found for this user.</td>
            </tr>
        `;
    } else {
        userRecordsTableBody.innerHTML = records.map(record => `
            <tr>
                <td>${record.id}</td>
                <td>${escapeHtml(record.bookTitle || 'N/A')}</td>
                <td>${formatDate(record.borrowDate)}</td>
                <td>${record.returnDate ? formatDate(record.returnDate) : 'Not returned'}</td>
                <td>
                    <span class="status-badge status-${record.status}">
                        ${record.status}
                    </span>
                </td>
            </tr>
        `).join('');
    }
    
    userRecordsResult.style.display = 'block';
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
