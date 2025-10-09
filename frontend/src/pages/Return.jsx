import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Return = () => {
  const navigate = useNavigate();
  const [returnedBooks, setReturnedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'returned', 'overdue'

  // Fetch returned books on component mount
  useEffect(() => {
    fetchReturnedBooks();
  }, []);

  const fetchReturnedBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view return history');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/borrow/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Filter for returned books
        const returned = response.data.data.filter(
          record => record.status === 'returned'
        );
        setReturnedBooks(returned);
      }
    } catch (err) {
      setError('Failed to fetch return history. Please try again.');
      console.error('Error fetching returned books:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysOverdue = (returnDate, borrowDate) => {
    if (!returnDate || !borrowDate) return 0;
    const returnDateObj = new Date(returnDate);
    const borrowDateObj = new Date(borrowDate);
    const diffTime = returnDateObj - borrowDateObj;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredBooks = returnedBooks
    .filter(record => {
      // Filter by search term (title or author)
      const matchesSearch = 
        record.bookId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.bookId?.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesFilter = 
        filterStatus === 'all' ||
        (filterStatus === 'overdue' && calculateDaysOverdue(record.returnDate, record.borrowDate) > 14);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate)); // Sort by return date (newest first)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Return History</h1>
          <p className="text-gray-600">View your returned books history</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Books
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Returns</option>
                <option value="overdue">Overdue Returns</option>
              </select>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Returned Books List */
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {filteredBooks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No returned books found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Borrowed On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Returned On
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days Borrowed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBooks.map((record) => {
                      const daysBorrowed = calculateDaysOverdue(record.returnDate, record.borrowDate);
                      const isOverdue = daysBorrowed > 14;
                      
                      return (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {record.bookId?.title || 'Unknown Book'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {record.bookId?.author || 'Unknown Author'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.borrowDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.returnDate ? formatDate(record.returnDate) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {daysBorrowed} days
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              isOverdue 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {isOverdue ? 'Overdue' : 'Returned'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

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

export default Return;