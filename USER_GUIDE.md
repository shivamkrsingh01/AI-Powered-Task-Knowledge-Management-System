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

- **Admin**: Can create tasks, upload documents, view analytics, and manage all tasks
- **User**: Can complete assigned tasks, search documents, download documents, and add comments to tasks

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
**What it does**: Allows you to assign work to users with priorities and due dates

**Fields**:
- **Title**: Name of the task (e.g., "Review policy document")
- **Description**: Detailed instructions for the task
- **Priority**: How urgent the task is (Low, Medium, High, Urgent)
- **Due Date**: When the task should be completed (optional)
- **Assign To**: Select which user should do this task

**Priority Levels**:
- **Low**: Can be done anytime
- **Medium**: Standard priority
- **High**: Should be done soon
- **Urgent**: Needs immediate attention

**What happens when you click "Create Task"**:
- The task is saved to the database with priority and due date
- It appears in the tasks list below
- The assigned user can now see it in their dashboard

**Example workflow**:
1. Enter title: "Read employee handbook"
2. Enter description: "Review the updated employee handbook and acknowledge understanding"
3. Select priority: "High"
4. Select due date: "2024-12-31"
5. Select user: "Regular User"
6. Click "Create Task"
7. Task is now visible to the assigned user with priority and due date

#### Task List Section
**What it shows**: All tasks with their details

**Columns**:
- **Title**: Task name (click to view details and comments)
- **Description**: Task details
- **Priority**: Color-coded priority level
- **Due Date**: When the task is due
- **Assigned To**: Who is responsible
- **Status**: Current state (pending/in_progress/completed/blocked/on_hold)

**Filter Buttons**:
- **Status Filters**: All, Pending, In Progress, Completed, Blocked, On Hold
- **Priority Filters**: All, Urgent, High, Medium, Low

**What happens when you click a filter**:
- The list updates to show only tasks matching that status/priority
- Helps you focus on specific task states

**What happens when you click a task title**:
- A modal opens showing full task details
- You can view and add comments
- See task history and metadata

---

### Documents Tab

#### Upload Document Section
**What it does**: Allows you to add documents for users to search through

**Supported formats**: PDF and TXT files

**What happens when you upload a document**:
1. The file is saved to the server
2. Text is extracted from the document
3. The text is split into smaller chunks (sentence-aware)
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
- **Action**: Download button

**What happens when you click Download**:
- The document is downloaded to your computer
- Activity is logged for analytics

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
Three main tabs:
1. **My Tasks** - View and complete assigned tasks
2. **Documents** - View and download available documents
3. **Search Documents** - Search through uploaded documents

---

### My Tasks Tab

#### Task List Section
**What it shows**: Only tasks assigned to you

**Columns**:
- **Title**: Task name (click to view details and add comments)
- **Description**: Task details
- **Priority**: Color-coded priority level
- **Due Date**: When the task is due
- **Status**: Current state (pending/in_progress/completed/blocked/on_hold)
- **Action**: Dropdown to change status

**Filter Buttons**:
- **All**: Shows all your tasks
- **Pending**: Shows only incomplete tasks
- **In Progress**: Shows tasks you're working on
- **Completed**: Shows only finished tasks
- **Blocked**: Shows tasks that are blocked
- **On Hold**: Shows tasks on hold

#### Status Update Dropdown
**What it does**: Allows you to change task status

**Available options**:
- **Pending**: Not started yet
- **In Progress**: Currently working on it
- **Completed**: Finished
- **Blocked**: Can't proceed due to issues
- **On Hold**: Temporarily paused

**What happens when you change status**:
- Task status updates immediately
- Admin sees the updated status in their dashboard
- Task statistics are updated

**Example workflow**:
1. See task: "Read employee handbook" (status: pending)
2. Change status to "In Progress" when you start reading
3. Change status to "Completed" when finished
4. Admin sees your progress through status changes

#### Task Details Modal
**What it does**: Shows full task information and allows comments

**What you can do**:
- View complete task details (title, description, priority, due date, etc.)
- Add comments to communicate with admin
- View existing comments with author and timestamp
- Delete your own comments

**Example workflow**:
1. Click on task title to open details modal
2. Add comment: "I have a question about section 3"
3. Admin can see your comment and respond
4. Use comments to clarify task requirements

---

### Documents Tab

#### Documents List Section
**What it shows**: All uploaded documents available for download

**Columns**:
- **Filename**: Name of the uploaded file
- **Type**: File format (PDF/TXT)
- **Uploaded By**: Who uploaded it
- **Uploaded At**: Date of upload
- **Action**: Download button

**What happens when you click Download**:
- The document is downloaded to your computer
- You can read it offline
- Use it to complete your tasks

**Example workflow**:
1. Task: "Review security policy"
2. Go to Documents tab
3. Find "security_policy.pdf"
4. Click Download
5. Read the document
6. Complete the task

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
4. Results are ranked by similarity score (percentage)
5. Top 10 results are displayed with context
6. Search is saved to history for quick re-search

**Why this is powerful**: You can search using different words than what's in the document and still find relevant information.

**Example searches**:
- Query: "How many vacation days do I get?"
- Finds: Text about vacation policy even if it says "annual leave" instead of "vacation"

#### Search History
**What it does**: Shows your recent searches

**What happens**:
- Last 10 searches are saved
- Click any search to re-run it
- Avoids typing the same query repeatedly

**Example workflow**:
1. Search for "remote work policy"
2. Later, click "remote work policy" in history to search again
3. Quick access to your common searches

#### Search Results Section
**What it shows**: Relevant document chunks with context

**For each result**:
- **Filename**: Which document contains this information
- **Similarity Score**: How closely it matches your query (percentage, higher is better)
- **Content**: The actual text from the document (highlighted in yellow)

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

### Task Priorities

**Why priorities matter**:
- Helps users focus on urgent tasks first
- Admins can see which tasks need attention
- Better task management and planning

**Priority Levels**:
- **Low** (green): Routine tasks
- **Medium** (yellow): Standard priority
- **High** (orange): Important tasks
- **Urgent** (red): Critical tasks

### Task Due Dates

**Why due dates matter**:
- Sets clear deadlines
- Helps with time management
- Admins can track overdue tasks

**How to use**:
- Set due dates when creating tasks
- Users can see when tasks are due
- Sort tasks by due date to prioritize

### Enhanced Task Statuses

**Why more statuses help**:
- Better tracking of task progress
- Clearer communication of task state
- Identifies blocked tasks that need attention

**Status Options**:
- **Pending**: Not started
- **In Progress**: Currently working
- **Completed**: Finished
- **Blocked**: Can't proceed (needs attention)
- **On Hold**: Temporarily paused

### Task Comments

**Why comments matter**:
- Enables collaboration on tasks
- Allows clarification of requirements
- Documents task-related discussions

**How to use**:
1. Click on task title to open details modal
2. Type your comment in the text area
3. Click "Add Comment"
4. Comments show author and timestamp
5. Delete your own comments if needed

### Improved Search

**Sentence-aware chunking**:
- Documents are split at sentence boundaries
- Better context in search results
- More precise matching

**More results**:
- Shows 10 results instead of 5
- Better coverage of relevant content
- Higher chance of finding what you need

**Search history**:
- Saves your recent searches
- Quick re-search with one click
- Avoids repetitive typing

### Document Download

**Why download matters**:
- Users can read documents offline
- Reference documents while completing tasks
- Better accessibility to knowledge base

**How to use**:
1. Go to Documents tab
2. Find the document you need
3. Click "Download" button
4. Document saves to your computer

---

## Workflow Examples

### Example 1: New Employee Onboarding

**Admin Actions**:
1. Upload employee handbook PDF
2. Upload security training PDF
3. Create task: "Read employee handbook" (High priority, due in 7 days)
4. Create task: "Complete security training" (Urgent priority, due in 3 days)

**User Actions**:
1. See both tasks in "My Tasks" with priorities and due dates
2. Go to Documents tab and download handbook
3. Read handbook sections
4. Add comment: "Section 3 is unclear"
5. Admin responds with clarification
6. Change status to "In Progress" when starting
7. Change status to "Completed" when done

**Result**: Admin can track onboarding progress through task completion and comments.

### Example 2: Policy Update

**Admin Actions**:
1. Upload updated vacation policy PDF
2. Create task: "Review new vacation policy" (High priority, due in 5 days) assigned to all users
3. Monitor analytics to see if users search for vacation info

**User Actions**:
1. See task in "My Tasks" with due date
2. Go to Documents tab and download new policy
3. Search "vacation days" to find specific sections
4. Read updated policy
5. Add comment: "Policy is clear"
6. Mark task complete

**Result**: Everyone is informed about policy changes systematically with feedback.

### Example 3: Research Task

**Admin Actions**:
1. Upload multiple research documents (PDFs)
2. Create task: "Research competitor pricing" (Medium priority, due in 10 days) assigned to user

**User Actions**:
1. See task with priority and due date
2. Download relevant documents from Documents tab
3. Search for "pricing" across all documents
4. Review results showing pricing information from various docs
5. Use information to complete research task
6. Change status from "Pending" → "In Progress" → "Completed"
7. Add comments about findings

**Result**: User can efficiently find information across multiple documents with progress tracking.

---

## Tips for Effective Use

### For Admins
- **Set appropriate priorities**: Help users know what to focus on first
- **Use due dates**: Set clear deadlines for better planning
- **Upload documents first**: Users need documents to search before they can complete research tasks
- **Create clear task descriptions**: Help users understand exactly what needs to be done
- **Use analytics**: Check what users are searching for to identify knowledge gaps
- **Assign appropriately**: Give tasks to users who have the right context
- **Monitor task comments**: Respond to user questions and clarifications

### For Users
- **Check priorities**: Focus on urgent and high-priority tasks first
- **Watch due dates**: Complete tasks before deadlines
- **Download documents**: Download relevant documents for offline reference
- **Use natural language**: Search like you would ask a question
- **Try different phrasings**: If one search doesn't work, try synonyms
- **Use search history**: Click recent searches to re-run them quickly
- **Update task status**: Keep status current so admin knows your progress
- **Add comments**: Ask questions or provide updates on tasks
- **Read context**: Search results show the surrounding text for better understanding

### For Both
- **Filter tasks**: Use status and priority filters to focus on what's relevant
- **Use task details**: Click task titles to see full information and add comments
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

### Can't download documents
- **Cause**: Documents tab not selected
- **Solution**: Click "Documents" tab to see available documents

### Comments not appearing
- **Cause**: Need to refresh or reopen task details
- **Solution**: Close and reopen the task details modal

### Search history not showing
- **Cause**: No searches performed yet
- **Solution**: Perform a search to populate history

---

## Summary

This system helps teams:
- **Assign and track work** through tasks with priorities and due dates
- **Share knowledge** through document uploads and downloads
- **Find information quickly** through improved semantic search with history
- **Collaborate on tasks** through comments
- **Monitor usage** through analytics

**Key benefit**: Combines task management with intelligent document search, making it easier to complete work that requires research or reference materials.
