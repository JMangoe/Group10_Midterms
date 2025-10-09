import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Borrow = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      if (response.data.success) {
        setBooks(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error('Error fetching books:', err);
    }
  };

  const handleBorrowBook = async (bookId) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to borrow books');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/borrow',
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess(`Successfully borrowed: ${selectedBook?.title}`);
        setSelectedBook(null);
        fetchBooks(); // Refresh book list
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book) => {
    if (book.availableCopies > 0) {
      setSelectedBook(book);
      setError('');
      setSuccess('');
    } else {
      setError('This book is currently unavailable');
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Borrow a Book</h1>
          <p className="text-gray-600">Browse available books and borrow one</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Selected Book Form */}
        {selectedBook && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border-2 border-blue-500">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Borrow</h2>
            <div className="mb-4">
              <p className="text-gray-700"><strong>Title:</strong> {selectedBook.title}</p>
              <p className="text-gray-700"><strong>Author:</strong> {selectedBook.author}</p>
              <p className="text-gray-700"><strong>Available Copies:</strong> {selectedBook.availableCopies}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleBorrowBook(selectedBook._id)}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Borrowing...' : 'Confirm Borrow'}
              </button>
              <button
                onClick={() => setSelectedBook(null)}
                disabled={loading}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Books List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Books</h2>
          
          {filteredBooks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No books found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className={`border rounded-lg p-4 transition-all ${
                    book.availableCopies > 0
                      ? 'border-gray-300 hover:border-blue-500 hover:shadow-md cursor-pointer'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  } ${selectedBook?._id === book._id ? 'border-blue-500 bg-blue-50' : ''}`}
                  onClick={() => handleSelectBook(book)}
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Book ID:</strong> {book.id}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className={`text-sm font-medium ${
                        book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {book.availableCopies > 0
                        ? `${book.availableCopies} available`
                        : 'Not available'}
                    </span>
                    {book.availableCopies > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBook(book);
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Select →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
