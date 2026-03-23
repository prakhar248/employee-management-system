# Employee Management System

A full-stack Employee Management System built with **React (Vite), Node.js, Express, and MySQL**, supporting CRUD operations, filtering, sorting, and search — fully deployed on cloud platforms.

---

## 🌐 Live Demo

- **Frontend:** https://prakhar248.github.io/employee-management-system/
- **Backend API:** https://employee-management-system-yj3n.onrender.com/api/employees

---

## 🏗️ Project Structure

```bash
employee-management/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── db.js
│   ├── schema.sql
│   └── routes/
│       └── employees.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── api/
│       │   └── employeeApi.js
│       └── components/
│           ├── EmployeeList.jsx
│           ├── AddEmployee.jsx
│           └── EditEmployee.jsx
```

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL (Railway)

### Deployment
- Frontend → GitHub Pages
- Backend → Render
- Database → Railway

---

## ⚙️ Local Setup

### 1. Clone the repository


git clone https://github.com/prakhar248/employee-management-system.git

cd employee-management-system


---

### 2. Backend setup


cd backend
npm install
npm start


Server runs at:

http://localhost:5000


---

### 3. Frontend setup


cd frontend
npm install
npm run dev


App runs at:

http://localhost:5173


---

## 🗄️ Database Setup

Run the schema file:


mysql -u root -p < backend/schema.sql


Or connect to Railway MySQL and run the same file.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|--------|------------|
| GET | /api/employees | Get all employees |
| GET | /api/employees/:id | Get single employee |
| POST | /api/employees | Create employee |
| PUT | /api/employees/:id | Update employee |
| DELETE | /api/employees/:id | Delete employee |
| GET | /api/employees/meta/departments | Get departments |

---

## ✨ Features

- CRUD operations (Create, Read, Update, Delete)
- Search employees by name or city
- Filter by department
- Sort by salary and age
- Dynamic statistics (count, average salary)
- Form validation (client + server)
- Modal-based UI for Add/Edit
- Responsive design
- Fully deployed full-stack system

---

## ⚠️ Notes

- Backend is hosted on Render (may take a few seconds to wake up)
- Uses environment variables for database credentials
- CORS enabled for frontend-backend communication

---

## 🧠 Learnings

- Full-stack deployment (frontend + backend + database)
- REST API design and integration
- Handling environment variables and CORS
- Debugging real-world deployment issues
- Cloud database integration

---

## 📌 Future Improvements

- Authentication (JWT)
- Pagination for large datasets
- Role-based access control
- Better UI feedback (loading states, toasts)

---

## 👨‍💻 Author

**Prakhar Chouhan**  
GitHub: https://github.com/prakhar248
