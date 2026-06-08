# TaskFlow - Role-Based Task Management System

TaskFlow is a Full Stack MERN (MongoDB, Express, React, Node.js) application designed to facilitate task assignment and tracking between Managers (Admins) and Employees/Students (Users). 

This project was built as a Backend Developer Intern Assignment, featuring secure JWT authentication, role-based access control (RBAC), and a modular, scalable architecture.

## 🚀 Live Demo
* **Frontend:** [Insert your Vercel Link here]
* **Backend API:** [Insert your Render Link here]

> **Note:** The backend is hosted on a free Render tier and goes to sleep after 15 minutes of inactivity. The first login/request may take 30-50 seconds to wake up the server.

---

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Tailwind CSS (v4)
* Context API (State Management)
* Lucide React (Icons)

**Backend:**
* Node.js & Express.js
* MongoDB (Atlas) & Mongoose
* JSON Web Tokens (JWT) for Authentication
* bcryptjs for Password Hashing

---

## ✨ Key Features

### 👑 Admin Interface (Manager)
* **Secure Provisioning:** The database is seeded with a default admin; new users cannot register as admins.
* **Global View:** View all users and all assigned tasks in the system.
* **Task Assignment:** Assign tasks to specific individuals or globally to "All Users" at once.
* **Review System:** Review submitted work links, provide feedback/comments, and mark tasks as "Completed" or revert them to "Pending".
* **Task Management:** Permanently delete tasks from the system.

### 👤 User Interface (Employee/Student)
* **Isolated Workspace:** Users only see tasks specifically assigned to them.
* **Work Submission:** Users can submit external links (e.g., GitHub repo, Google Doc) for their assigned tasks.
* **Feedback Loop:** View admin comments/feedback on submitted work.

---

## 💻 Local Installation & Setup

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas Account (or Local MongoDB)

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd backend-intern-assignment
```
### 2. Setup Backend
```bash
cd backend
npm install
```
* Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

* Start the backend server:
```bash
npm run dev
```

(The server will start on port 5000 and automatically seed a default Admin account: admin@taskflow.com / admin123)

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```
* Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port Vite assigns).


***Developed by Avni Shukla for Backend Developer Intern Assignment.***
