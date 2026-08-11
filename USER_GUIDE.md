# User Guide - Task & Knowledge Management System

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Admin Dashboard](#admin-dashboard)
4. [User Dashboard](#user-dashboard)
5. [Feature Explanations](#feature-explanations)
6. [Workflow Examples](#workflow-examples)

---

## Overview

This is a task and knowledge management system with two user roles:

- **Admin**: Can create tasks, upload documents, and view analytics
- **User**: Can complete assigned tasks and search through uploaded documents

The system uses AI-powered semantic search to find relevant content in uploaded documents.

---

## Getting Started

### Login
1. Open the application in your browser
2. Enter your credentials:
   - **Admin**: admin@example.com / admin123
   - **User**: user@example.com / user123
3. Click "Login"

### What happens during login?
- The system verifies your email and password
- If correct, you receive a secure token (JWT) that keeps you logged in
- You're redirected to your dashboard based on your role

---

## Admin Dashboard

### Navigation Bar
- **Welcome message**: Shows your email address
- **Logout button**: Signs you out and returns to login page

### Statistics Cards (Top of Dashboard)
Three cards showing:
- **Total Tasks**: Number of all tasks in the system
- **Completed**: Number of tasks marked as completed
- **Pending**: Number of tasks still pending

### Tab Navigation
Three main tabs:
1. **Tasks** - Manage and create tasks
2. **Documents** - Upload and view documents
3. **Analytics** - View search statistics

---

### Tasks Tab

#### Create Task Section
**What it does**: Allows you to assign work to users

**Fields**:
- **Title**: Name of the task (e.g., "Review policy document")
- **Description**: Detailed instructions for the task
- **Assign To**: Select which user should do this task

**What happens when you click "Create Task"**:
- The task is saved to the database
- It appears in the tasks list below
- The assigned user can now see it in their dashboard

**Example workflow**:
1. Enter title: "Read employee handbook"
2. Enter description: "Review the updated employee handbook and acknowledge understanding"
3. Select user: "Regular User"
4. Click "Create Task"
5. Task is now visible to the assigned user

#### Task List Section
**What it shows**: All tasks with their details

**Columns**:
- **Title**: Task name
- **Description**: Task details
- **Assigned To**: Who is responsible
- **Status**: Current state (pending/completed)

**Filter Buttons**:
- **All**: Shows all tasks
- **Pending**: Shows only incomplete tasks
- **Completed**: Shows only finished tasks

**What happens when you click a filter**:
- The list updates to show only tasks matching that status
- Helps you focus on specific task states

---

### Documents Tab

#### Upload Document Section
**What it does**: Allows you to add documents for users to search through

**Supported formats**: PDF and TXT files

**What happens when you upload a document**:
1. The file is saved to the server
2. Text is extracted from the document
3. The text is split into smaller chunks
4. Each chunk is converted to a mathematical representation (embedding)
5. These embeddings are stored for fast semantic search
6. The document appears in the documents list

**Example workflow**:
1. Click "Choose File" and select a PDF about company policies
2. Click "Upload"
3. Wait for upload to complete
4. Document is now searchable by users

**Why this matters**: Users can now search for information in this document using natural language queries, not just exact word matches.

#### Documents List Section
**What it shows**: All uploaded documents with metadata

**Columns**:
- **Filename**: Name of the uploaded file
- **Type**: File format (PDF/TXT)
- **Uploaded By**: Who uploaded it
- **Uploaded At**: Date of upload

**What happens**: You can see all available documents at a glance

---

### Analytics Tab

#### Most Searched Queries Section
**What it does**: Shows what users are searching for most frequently

**Columns**:
- **Query**: The search term users entered
- **Count**: How many times it was searched

**What happens**:
- Every time a user performs a search, it's logged
- This tab aggregates and displays the most popular searches
- Helps admins understand what information users need

**Example use case**:
- If "vacation policy" appears 50 times, you know users are confused about vacation rules
- You might create a task to clarify the vacation policy document

---

## User Dashboard

### Navigation Bar
- **Welcome message**: Shows your email address
- **Logout button**: Signs you out and returns to login page

### Tab Navigation
Two main tabs:
1. **My Tasks** - View and complete assigned tasks
2. **Search Documents** - Search through uploaded documents

---

### My Tasks Tab

#### Task List Section
**What it shows**: Only tasks assigned to you

**Columns**:
- **Title**: Task name
- **Description**: Task details
- **Status**: Current state (pending/completed)
- **Action**: Button to complete the task

**Filter Buttons**:
- **All**: Shows all your tasks
- **Pending**: Shows only incomplete tasks
- **Completed**: Shows only finished tasks

#### Mark Complete Button
**What it does**: Changes task status from "pending" to "completed"

**When does it appear**: Only for tasks with "pending" status

**What happens when you click it**:
- Task status changes to "completed"
- The button disappears (can't complete twice)
- Admin sees the updated status in their dashboard
- Task statistics are updated

**Example workflow**:
1. See task: "Read employee handbook" (status: pending)
2. Read the handbook
3. Click "Mark Complete"
4. Task status changes to "completed"
5. Admin sees you've finished the task

---

### Search Documents Tab

#### Search Form
**What it does**: Allows you to find relevant information in uploaded documents

**Field**:
- **Search Query**: Enter what you're looking for in natural language

**What happens when you click "Search"**:
1. Your query is converted to a mathematical representation (embedding)
2. The system compares it to all document chunks
3. It finds the most similar chunks based on meaning, not just exact words
4. Results are ranked by similarity score
5. Top results are displayed with context

**Why this is powerful**: You can search using different words than what's in the document and still find relevant information.

**Example searches**:
- Query: "How many vacation days do I get?"
- Finds: Text about vacation policy even if it says "annual leave" instead of "vacation"

#### Search Results Section
**What it shows**: Relevant document chunks with context

**For each result**:
- **Filename**: Which document contains this information
- **Similarity Score**: How closely it matches your query (0-1, higher is better)
- **Content**: The actual text from the document

**What happens when you see results**:
- You can read the relevant text
- You know which document it came from
- You can use this information to complete your tasks

**Example workflow**:
1. Task: "Find information about remote work policy"
2. Go to Search Documents tab
3. Enter: "can I work from home"
4. Click Search
5. See results showing remote work policy sections
6. Use information to complete task

---

## Feature Explanations

### Semantic Search vs. Traditional Search

**Traditional Search (Ctrl+F)**:
- Only finds exact word matches
- "Vacation" won't find "holiday" or "time off"
- Misses relevant information with different wording

**Semantic Search (This System)**:
- Understands meaning and context
- "Vacation" finds "holiday", "time off", "annual leave"
- Finds relevant information even with different words
- Uses AI to understand what you mean

**Example**:
- Query: "time off request process"
- Finds: Text about "how to apply for leave" even without the words "time off"

### Task Assignment Workflow

**Admin side**:
1. Create task with title and description
2. Assign to specific user
3. Task appears in user's dashboard

**User side**:
1. See assigned task in "My Tasks"
2. Complete the work
3. Click "Mark Complete"
4. Admin sees completion

**Why this matters**: Clear accountability and tracking of work progress.

### Document Processing Pipeline

**What happens when you upload a document**:

1. **File Upload**: Document is saved to server
2. **Text Extraction**:
   - PDF: Text is extracted from each page
   - TXT: Text is read directly
3. **Chunking**: Text is split into smaller pieces (~800 characters)
4. **Embedding Generation**: Each chunk is converted to a vector (mathematical representation)
5. **Indexing**: Vectors are stored in FAISS index for fast search
6. **Ready for Search**: Users can now query the document

**Why chunking matters**: 
- Makes search more precise (finds specific sections)
- Allows showing context around matches
- Improves search performance

### Activity Logging

**What gets logged**:
- User logins
- Document uploads
- Search queries
- Task status changes

**Where it's used**:
- Analytics tab shows most searched queries
- Helps admins understand user behavior
- Can be used to improve the system

---

## Workflow Examples

### Example 1: New Employee Onboarding

**Admin Actions**:
1. Upload employee handbook PDF
2. Create task: "Read employee handbook" assigned to new employee
3. Create task: "Complete security training" assigned to new employee

**User Actions**:
1. See both tasks in "My Tasks"
2. Search for "security training" to find relevant documents
3. Read handbook sections
4. Mark tasks as complete when done

**Result**: Admin can track onboarding progress through task completion.

### Example 2: Policy Update

**Admin Actions**:
1. Upload updated vacation policy PDF
2. Create task: "Review new vacation policy" assigned to all users
3. Monitor analytics to see if users search for vacation info

**User Actions**:
1. See task in "My Tasks"
2. Search "vacation days" to find new policy
3. Read updated policy
4. Mark task complete

**Result**: Everyone is informed about policy changes systematically.

### Example 3: Research Task

**Admin Actions**:
1. Upload multiple research documents (PDFs)
2. Create task: "Research competitor pricing" assigned to user

**User Actions**:
1. Search for "pricing" across all documents
2. Review results showing pricing information from various docs
3. Use information to complete research task
4. Mark task complete

**Result**: User can efficiently find information across multiple documents.

---

## Tips for Effective Use

### For Admins
- **Upload documents first**: Users need documents to search before they can complete research tasks
- **Create clear task descriptions**: Help users understand exactly what needs to be done
- **Use analytics**: Check what users are searching for to identify knowledge gaps
- **Assign appropriately**: Give tasks to users who have the right context

### For Users
- **Use natural language**: Search like you would ask a question
- **Try different phrasings**: If one search doesn't work, try synonyms
- **Read context**: Search results show the surrounding text for better understanding
- **Complete tasks promptly**: Helps admins track progress

### For Both
- **Filter tasks**: Use status filters to focus on what's relevant
- **Logout when done**: Keeps your account secure
- **Provide feedback**: If search isn't working well, try different query terms

---

## Troubleshooting

### Search returns no results
- **Cause**: No documents uploaded yet
- **Solution**: Ask admin to upload relevant documents

### Can't see tasks
- **Cause**: No tasks assigned to you
- **Solution**: Ask admin to assign tasks

### Document upload fails
- **Cause**: File format not supported
- **Solution**: Use only PDF or TXT files

### Login fails
- **Cause**: Wrong credentials
- **Solution**: Check email and password, ask admin for correct credentials

---

## Summary

This system helps teams:
- **Assign and track work** through tasks
- **Share knowledge** through document uploads
- **Find information quickly** through semantic search
- **Monitor usage** through analytics

**Key benefit**: Combines task management with intelligent document search, making it easier to complete work that requires research or reference materials.
