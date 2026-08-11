# Quick Start Guide

## Before Running the Application

### Step 1: Configure Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   copy env_template.txt .env
   ```

3. Edit `.env` and update these values:
   - Replace `your_password` with your MySQL root password
   - Optionally change the JWT_SECRET_KEY to a secure random string

### Step 2: Create MySQL Database

Run this SQL command in your MySQL client:
```sql
CREATE DATABASE task_knowledge_db;
```

### Step 3: Initialize Database

```bash
python init_db.py
```

This will create tables, roles, and demo users.

### Step 4: Start Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

### Step 5: Start Frontend (in new terminal)

```bash
cd frontend
npm run dev
```

Frontend runs on http://localhost:5173

### Step 6: Access the Application

Open http://localhost:5173 in your browser.

**Demo Credentials:**
- Admin: admin@example.com / admin123
- User: user@example.com / user123

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL service is running
- Verify password in .env is correct
- Check that the database exists

### Port Already in Use
- Change backend port: `uvicorn app.main:app --port 8001 --reload`
- Change frontend port: Edit `vite.config.js` and change port value

### Module Import Errors
- Ensure you're in the backend directory when running Python commands
- Run `pip install -r requirements.txt` again

## Testing the Application

1. **Login as Admin**: Upload a PDF/TXT document, create a task
2. **Login as User**: Search documents, complete assigned tasks
3. **Check Analytics**: View task stats and search queries (Admin only)
