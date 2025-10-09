import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';

const Borrow = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

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

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'available') {
      return matchesSearch && book.availableCopies > 0;
    }
    
    if (filter === 'popular') {
      // Assuming we have a popularity field, otherwise sort by available copies
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  const handleBorrow = async (bookId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      await axios.post(
        'http://localhost:5000/api/borrow',
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh the books list
      await fetchBooks();
      setSuccess('Book borrowed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Available Books</h1>
            <p className="mt-2 text-gray-600">Browse and borrow books from our collection</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Books</option>
                  <option value="available">Available Now</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mt-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mt-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}

          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book) => (
                <Card key={book._id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                      <p className="text-gray-600 text-sm">{book.author}</p>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
                        </span>
                        
                        <Button 
                          onClick={() => handleBorrow(book._id)}
                          disabled={book.availableCopies === 0 || loading}
                          className="ml-2"
                          variant={book.availableCopies > 0 ? 'primary' : 'secondary'}
                        >
                          {loading ? 'Borrowing...' : 'Borrow'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
        </Card>

        <div className="mt-6 text-center">
          <Button 
            variant="secondary"
            className="flex items-center mx-auto"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
