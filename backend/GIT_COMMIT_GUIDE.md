# Git Commit Guide - User Feature Tasks

Follow these commands to commit each task individually to GitHub.

## Initial Setup (Do this first)

```bash
# Make sure you're in the backend directory
cd backend

# Check git status
git status

# If not initialized, initialize git (skip if already done)
git init
```

---

## Task 1: [USR-01] Create User Model

**Files to commit:**
- `model/User.js`

**Commands:**
```bash
git add model/User.js
git commit -m "[USR-01] Create User model with fields: id, username, password, role"
git push origin main
```

---

## Task 2: [USR-02] Add Validators

**Files to commit:**
- `validators/Validators.js`

**Commands:**
```bash
git add validators/Validators.js
git commit -m "[USR-02] Add validator for registration & login input (username required, password min. 6 chars)"
git push origin main
```

---

## Task 3: [USR-03] Implement Registration Service

**Files to commit:**
- `services/Services.js` (registerUser function)

**Commands:**
```bash
git add services/Services.js
git commit -m "[USR-03] Implement service to register a new user (with password hashing)"
git push origin main
```

---

## Task 4: [USR-04] Implement Authentication Service

**Files to commit:**
- `services/Services.js` (authenticateUser function - already in same file)

**Commands:**
```bash
# If you already committed Services.js in USR-03, you can amend or create a note
# Since both functions are in the same file, you might have committed them together
# If not yet committed, use:
git add services/Services.js
git commit -m "[USR-04] Implement service to authenticate user (check password, return token/session)"
git push origin main
```

---

## Task 5: [USR-05] Implement Controllers

**Files to commit:**
- `controllers/userController.js`

**Commands:**
```bash
git add controllers/userController.js
git commit -m "[USR-05] Implement controllers for register & login"
git push origin main
```

---

## Task 6: [USR-06] Setup Routes

**Files to commit:**
- `routes/userRoutes.js`

**Commands:**
```bash
git add routes/userRoutes.js
git commit -m "[USR-06] Setup routes: POST /api/register, POST /api/login"
git push origin main
```

---

## Task 7: [USR-07] Add Authentication Middleware

**Files to commit:**
- `middleware/authMiddleware.js`

**Commands:**
```bash
git add middleware/authMiddleware.js
git commit -m "[USR-07] Add middleware to protect routes so only logged-in users can access borrow/book endpoints"
git push origin main
```

---

## Additional: Server Setup & Configuration

**Files to commit:**
- `server.js`
- `.env`
- `.gitignore`
- `README.md`
- `package.json` (if modified)

**Commands:**
```bash
git add server.js .gitignore README.md
git commit -m "Setup Express server and project configuration"
git push origin main

# Note: .env should NOT be committed (it's in .gitignore)
# Create .env.example instead for team reference
```

---

## Complete Workflow (All at Once - Alternative)

If you prefer to commit all at once:

```bash
git add .
git commit -m "[USR-01 to USR-07] Complete user authentication feature implementation"
git push origin main
```

---

## Verify Your Commits

```bash
# View commit history
git log --oneline

# View what files changed in last commit
git show --name-only
```

---

## Important Notes

1. ✅ `.env` file is in `.gitignore` - it will NOT be committed (this is correct for security)
2. ✅ Each commit should have a clear message referencing the ticket number
3. ✅ Push after each commit to keep GitHub updated
4. ✅ If working in a team, pull before pushing: `git pull origin main`

---

## Creating Feature Branch (Recommended)

```bash
# Create and switch to feature branch
git checkout -b feature/user-authentication

# After all commits, merge to main
git checkout main
git merge feature/user-authentication
git push origin main
```
