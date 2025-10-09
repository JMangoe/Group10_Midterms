# Library Borrowing System - User Feature (Backend)

## Developer 1 - User Authentication & Authorization

This backend implementation provides complete user registration, login, and authentication functionality for the Library Borrowing System.

## Features Implemented

### ✅ All Tickets Completed

- **[USR-01]** User model with fields: id, username, password, role
- **[USR-02]** Input validators for registration & login
- **[USR-03]** User registration service with bcrypt password hashing
- **[USR-04]** User authentication service with JWT token generation
- **[USR-05]** Controllers for register & login endpoints
- **[USR-06]** API routes: POST /api/register, POST /api/login
- **[USR-07]** Authentication middleware to protect routes

## Project Structure

```
backend/
├── controllers/
│   └── userController.js       # Register & login controllers
├── middleware/
│   └── authMiddleware.js       # JWT authentication middleware
├── model/
│   └── User.js                 # User schema (Mongoose)
├── routes/
│   └── userRoutes.js           # API routes
├── services/
│   └── Services.js             # Business logic (registration, authentication)
├── validators/
│   └── Validators.js           # Input validation middleware
├── .env                        # Environment variables
├── server.js                   # Express server setup
└── package.json                # Dependencies
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Edit `.env` file with your MongoDB URI and JWT secret
   - Default MongoDB: `mongodb://localhost:27017/library_system`
   - **Important:** Change JWT_SECRET in production!

3. **Start MongoDB:**
   - Make sure MongoDB is running on your system
   - Default port: 27017

4. **Run the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npx nodemon server.js
   ```

## API Endpoints

### 1. Register New User
**POST** `/api/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "role": "user"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "role": "user"
  }
}
```

**Validation Rules:**
- Username: required, minimum 3 characters
- Password: required, minimum 6 characters
- Role: optional, defaults to "user" (can be "user" or "admin")

---

### 2. Login User
**POST** `/api/login`

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "role": "user"
  }
}
```

**Token Expiration:** 24 hours

---

### 3. Protected Routes (Example)
To access protected routes, include the JWT token in the Authorization header:

**Header:**
```
Authorization: Bearer <your-jwt-token>
```

**Example protected route usage:**
```javascript
const { authenticateToken } = require('./middleware/authMiddleware');

// Protect a route
router.get('/books/borrow', authenticateToken, borrowBookController);
```

## Authentication Middleware

### `authenticateToken`
Verifies JWT token and attaches user info to `req.user`

**Usage:**
```javascript
const { authenticateToken } = require('./middleware/authMiddleware');

router.get('/protected-route', authenticateToken, (req, res) => {
  // Access user info via req.user
  console.log(req.user.id);
  console.log(req.user.username);
  console.log(req.user.role);
});
```

### `isAdmin` (Bonus)
Checks if authenticated user has admin role

**Usage:**
```javascript
const { authenticateToken, isAdmin } = require('./middleware/authMiddleware');

router.delete('/books/:id', authenticateToken, isAdmin, deleteBookController);
```

## Testing the API

### Using cURL:

**Register:**
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

**Access Protected Route:**
```bash
curl http://localhost:3000/api/protected \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client:
1. Create a POST request to `http://localhost:3000/api/register`
2. Set Content-Type to `application/json`
3. Add JSON body with username and password
4. Send request and save the token from login response
5. Use token in Authorization header for protected routes

## Security Features

- ✅ **Password Hashing:** bcrypt with 10 salt rounds
- ✅ **JWT Authentication:** Secure token-based auth
- ✅ **Input Validation:** Server-side validation for all inputs
- ✅ **Error Handling:** Proper error messages without exposing sensitive info
- ✅ **CORS Enabled:** Cross-origin resource sharing configured
- ✅ **Environment Variables:** Sensitive data stored in .env

## Dependencies

- **express** (^5.1.0) - Web framework
- **mongoose** (^8.19.1) - MongoDB ODM
- **bcrypt** (^6.0.0) - Password hashing
- **jsonwebtoken** (^9.0.2) - JWT token generation/verification
- **dotenv** (^17.2.3) - Environment variable management
- **cors** (^2.8.5) - CORS middleware
- **nodemon** (^3.1.10) - Development auto-reload

## Integration with Other Features

Other developers can use the authentication middleware to protect their routes:

```javascript
// In bookRoutes.js (Developer 2)
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/books', authenticateToken, addBookController);
router.get('/books', getBookController); // Public route
```

## Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "errors": ["Username is required", "Password must be at least 6 characters long"]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid username or password"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

## Next Steps for Team Integration

1. **Frontend Developers:** Use these endpoints to build login/register UI
2. **Other Backend Developers:** Import `authenticateToken` middleware to protect your routes
3. **Database:** Ensure MongoDB is running and accessible
4. **Testing:** Test all endpoints before integration

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/user-authentication

# Add all user feature files
git add .

# Commit with ticket references
git commit -m "[USR-01 to USR-07] Implement user authentication and authorization"

# Push to GitHub
git push origin feature/user-authentication
```

## Author
Developer 1 - User Feature Implementation

## License
ISC
