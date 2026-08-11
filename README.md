# Task & Knowledge Management System

A minimal AI-powered task and knowledge management system MVP with semantic search capabilities.

## Project Description

View:- https://drive.google.com/drive/folders/1byd-odJl_XVxnrI4mOUUIvHyjFl29-L6?usp=sharing

This is a working MVP that demonstrates:
- JWT-based authentication with role-based access control (RBAC)
- Task management with assignment and status tracking
- Document upload and processing (PDF/TXT)
- Local embedding-based semantic search using sentence-transformers and FAISS
- Activity logging and basic analytics
- Clean React frontend with FastAPI backend

## Features

- **Authentication**: JWT-based login system with secure password hashing
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Task Management**: Create, assign, and track tasks with status filtering
- **Document Upload**: Upload PDF and TXT files with automatic text extraction
- **Semantic Search**: AI-powered search using local embeddings (no paid APIs)
- **Activity Logging**: Track user actions (login, upload, search, task updates)
- **Analytics**: View task statistics and most searched queries

## Architecture Overview

```
backend/
├── app/
│   ├── core/          # Configuration, database, security
│   ├── models/        # SQLAlchemy ORM models
│   ├── schemas/       # Pydantic validation schemas
│   ├── routers/       # FastAPI route handlers
│   ├── services/      # Business logic
│   └── dependencies/  # Authentication dependencies
├── uploads/           # Uploaded documents
├── vector_store/      # FAISS index and metadata
└── init_db.py         # Database initialization

frontend/
└── src/
    ├── components/    # Reusable components
    ├── pages/         # Page components
    ├── services/      # API service layer
    └── context/       # React context for auth
```

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy ORM
- MySQL
- Pydantic
- JWT authentication (python-jose)
- bcrypt password hashing
- PyPDF2 for PDF extraction
- sentence-transformers for embeddings
- FAISS for vector similarity search

### Frontend
- React 18
- React Router
- Axios
- Vite

## Folder Structure

```
task-knowledge-system/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── role.py
│   │   │   ├── task.py
│   │   │   ├── document.py
│   │   │   └── activity_log.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── task.py
│   │   │   ├── document.py
│   │   │   ├── search.py
│   │   │   └── analytics.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── tasks.py
│   │   │   ├── documents.py
│   │   │   ├── search.py
│   │   │   └── analytics.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── task_service.py
│   │   │   ├── document_service.py
│   │   │   ├── embedding_service.py
│   │   │   ├── search_service.py
│   │   │   └── analytics_service.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   └── main.py
│   ├── uploads/
│   ├── vector_store/
│   ├── requirements.txt
│   ├── .env.example
│   └── init_db.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── UserDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── screenshots/
├── README.md
└── SETUP.md
```

## Prerequisites

- Python 3.10 or higher
- MySQL 8.0 or higher
- Node.js 16 or higher
- npm or yarn

## MySQL Setup

1. Install MySQL if not already installed
2. Start MySQL service
3. Create a database:

```sql
CREATE DATABASE task_knowledge_db;
```

## Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a `.env` file based on `.env.example`:

```env
DATABASE_URL=mysql+pymysql://root:your_password@localhost:3306/task_knowledge_db
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Replace `your_password` with your MySQL root password.

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Initialize the database:

```bash
python init_db.py
```

This will:
- Create all database tables
- Create Admin and User roles
- Create demo users (admin@example.com / admin123, user@example.com / user123)
- Create sample tasks

5. Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will run on http://localhost:8000

## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The frontend will run on http://localhost:5173

## Environment Variables

Create a `.env` file in the `backend/` directory with:

- `DATABASE_URL`: MySQL connection string
- `JWT_SECRET_KEY`: Secret key for JWT token signing
- `JWT_ALGORITHM`: Algorithm for JWT (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time in minutes (default: 30)

## How to Run

1. Start MySQL service
2. Navigate to backend directory and run:
   ```bash
   uvicorn app.main:app --reload
   ```
3. In a new terminal, navigate to frontend directory and run:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 in your browser

## Demo Credentials

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: user123

## API Overview

### Authentication
- `POST /api/auth/login` - Login and receive JWT token

### Tasks
- `GET /api/tasks` - Get tasks (with optional filters: ?status=pending, ?assigned_to=2)
- `POST /api/tasks` - Create a new task (Admin only)
- `GET /api/tasks/{task_id}` - Get specific task details
- `PATCH /api/tasks/{task_id}` - Update task status

### Documents
- `POST /api/documents` - Upload a document (Admin only)
- `GET /api/documents` - List all documents

### Search
- `POST /api/search` - Semantic search across documents

### Analytics
- `GET /api/analytics` - Get task statistics and search analytics (Admin only)

## How Semantic Search Works

The semantic search pipeline:

1. **Document Upload**: Admin uploads a PDF or TXT file
2. **Text Extraction**: 
   - PDF: PyPDF2 extracts text from pages
   - TXT: Direct file reading
3. **Text Chunking**: Text is split into chunks (~800 characters with 100-character overlap)
4. **Embedding Generation**: Each chunk is converted to a vector using sentence-transformers (all-MiniLM-L6-v2 model)
5. **FAISS Index**: Vectors are stored in a FAISS index for fast similarity search
6. **Query Processing**: When a user searches, the query is converted to an embedding
7. **Similarity Search**: FAISS finds the most similar chunks based on cosine similarity
8. **Results**: Returns relevant chunks with document metadata and similarity scores

This approach enables semantic understanding - finding relevant content even when exact words don't match.

## Screenshots

Add screenshots to the `screenshots/` folder demonstrating:

1. Login page
2. Admin dashboard with task statistics
3. Document upload interface
4. Task creation and assignment
5. User dashboard with assigned tasks
6. Semantic search results
7. Completed task view
8. Analytics dashboard

## Limitations / Future Improvements

### Current Limitations
- Single-user assignment per task
- Basic task status (pending/completed only)
- No task dependencies or priorities
- Simple chunking strategy
- No document versioning
- No user profile management
- No email notifications
- No real-time updates

### Future Improvements
- Add more task statuses (in progress, blocked, etc.)
- Implement task priorities and due dates
- Add document versioning
- Implement user profile editing
- Add email notifications for task assignments
- Real-time updates using WebSockets
- Advanced chunking strategies
- Support for more document formats (DOCX, etc.)
- Multi-language support
- Advanced analytics and reporting
- Task comments and collaboration

## License

This is a demonstration MVP project for educational purposes.
#
