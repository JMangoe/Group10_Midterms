// [FE2-03] Backend API Configuration
const API_BASE_URL = 'http://localhost:3000/api/books';

// State management
let allBooks = [];
let filteredBooks = [];

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const editBookForm = document.getElementById('editBookForm');
const bookTableBody = document.getElementById('bookTableBody');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');
const cancelEdit = document.getElementById('cancelEdit');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadBooks();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // [FE2-01] Add Book Form Submit
    addBookForm.addEventListener('submit', handleAddBook);
    
    // [FE2-02] Edit Book Form Submit
    editBookForm.addEventListener('submit', handleEditBook);
    
    // [FE2-05] Search functionality
    searchBtn.addEventListener('click', handleSearch);
    clearSearchBtn.addEventListener('click', clearSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Modal controls
    closeModal.addEventListener('click', closeEditModal);
    cancelEdit.addEventListener('click', closeEditModal);
    window.addEventListener('click', function(e) {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// [FE2-03] API Functions

// Load all books from backend
async function loadBooks() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch books');
        
        allBooks = await response.json();
        filteredBooks = [...allBooks];
        renderBooks(filteredBooks);
    } catch (error) {
        console.error('Error loading books:', error);
        showAlert('Error loading books. Using demo data.', 'error');
        // Demo data for testing without backend
        allBooks = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availableCopies: 5 },
            { id: 2, title: '1984', author: 'George Orwell', availableCopies: 3 },
            { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', availableCopies: 7 }
        ];
        filteredBooks = [...allBooks];
        renderBooks(filteredBooks);
    }
}

// [FE2-01] Add new book
async function handleAddBook(e) {
    e.preventDefault();
    
    const formData = new FormData(addBookForm);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        availableCopies: parseInt(formData.get('availableCopies'))
    };
    
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) throw new Error('Failed to add book');
        
        const newBook = await response.json();
        showAlert('Book added successfully!', 'success');
        addBookForm.reset();
        loadBooks(); // Reload the book list
    } catch (error) {
        console.error('Error adding book:', error);
        showAlert('Error adding book. Please try again.', 'error');
        // Demo mode: add to local array
        const newBook = {
            id: allBooks.length + 1,
            ...bookData
        };
        allBooks.push(newBook);
        filteredBooks = [...allBooks];
        renderBooks(filteredBooks);
        addBookForm.reset();
        showAlert('Book added (demo mode)', 'success');
    }
}

// [FE2-02] Edit book
async function handleEditBook(e) {
    e.preventDefault();
    
    const bookId = document.getElementById('editBookId').value;
    const formData = new FormData(editBookForm);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        availableCopies: parseInt(formData.get('availableCopies'))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });
        
        if (!response.ok) throw new Error('Failed to update book');
        
        showAlert('Book updated successfully!', 'success');
        closeEditModal();
        loadBooks();
    } catch (error) {
        console.error('Error updating book:', error);
        showAlert('Error updating book. Please try again.', 'error');
        // Demo mode: update local array
        const index = allBooks.findIndex(b => b.id == bookId);
        if (index !== -1) {
            allBooks[index] = { id: parseInt(bookId), ...bookData };
            filteredBooks = [...allBooks];
            renderBooks(filteredBooks);
            closeEditModal();
            showAlert('Book updated (demo mode)', 'success');
        }
    }
}

// [FE2-02] Delete book
async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${bookId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete book');
        
        showAlert('Book deleted successfully!', 'success');
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        showAlert('Error deleting book. Please try again.', 'error');
        // Demo mode: remove from local array
        allBooks = allBooks.filter(b => b.id !== bookId);
        filteredBooks = [...allBooks];
        renderBooks(filteredBooks);
        showAlert('Book deleted (demo mode)', 'success');
    }
}

// [FE2-05] Search/Filter books
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredBooks = [...allBooks];
    } else {
        filteredBooks = allBooks.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    renderBooks(filteredBooks);
}

function clearSearch() {
    searchInput.value = '';
    filteredBooks = [...allBooks];
    renderBooks(filteredBooks);
}

// [FE2-02] Render books in table
function renderBooks(books) {
    if (books.length === 0) {
        bookTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data">No books found.</td>
            </tr>
        `;
        return;
    }
    
    bookTableBody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${escapeHtml(book.title)}</td>
            <td>${escapeHtml(book.author)}</td>
            <td>${book.availableCopies}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal(${book.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal functions
function openEditModal(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (!book) return;
    
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookCopies').value = book.availableCopies;
    
    editModal.classList.add('active');
}

function closeEditModal() {
    editModal.classList.remove('active');
    editBookForm.reset();
}

// Utility functions
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible for inline onclick handlers
window.openEditModal = openEditModal;
window.deleteBook = deleteBook;
