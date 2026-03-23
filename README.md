# Employee Management System
Full-stack app: React + Node.js/Express + MySQL

---

## Project Structure

```
employee-management/
├── backend/
│   ├── package.json
│   ├── server.js          ← Express server (port 5000)
│   ├── db.js              ← MySQL connection
│   ├── schema.sql         ← Database & table setup
│   └── routes/
│       └── employees.js   ← All CRUD routes
└── frontend/
    ├── package.json
    └── src/
        ├── index.js
        ├── App.js
        ├── App.css
        ├── api/
        │   └── employeeApi.js    ← Axios API helpers
        └── components/
            ├── EmployeeList.js   ← Main table + search/filter/sort
            ├── AddEmployee.js    ← Add modal form
            └── EditEmployee.js   ← Edit modal form
```

---

## Prerequisites

- Node.js v16+ — https://nodejs.org
- MySQL 8+ — https://dev.mysql.com/downloads/

---

## Step 1 — Set up MySQL Database

Open your MySQL client (MySQL Workbench, TablePlus, or CLI) and run:

```sql
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)   NOT NULL,
  age        INT            NOT NULL,
  department VARCHAR(100)   NOT NULL,
  salary     DECIMAL(10, 2) NOT NULL,
  city       VARCHAR(100)   NOT NULL,
  created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional: seed sample data
INSERT INTO employees (name, age, department, salary, city) VALUES
  ('Alice Johnson',   29, 'Engineering', 85000.00, 'New York'),
  ('Bob Martinez',    35, 'Marketing',   62000.00, 'Los Angeles'),
  ('Carol Williams',  42, 'HR',          57000.00, 'Chicago'),
  ('David Lee',       31, 'Engineering', 92000.00, 'San Francisco'),
  ('Eva Brown',       27, 'Design',      74000.00, 'Austin');
```

Or just run the provided file:
```bash
mysql -u root -p < backend/schema.sql
```

---

## Step 2 — Configure Database Connection

Open `backend/db.js` and update your credentials:

```js
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // ← your MySQL username
  password: "",       // ← your MySQL password
  database: "employee_db",
});
```

---

## Step 3 — Start the Backend

```bash
cd backend
npm install
npm start           # uses node server.js
# OR for auto-reload:
npm run dev         # uses nodemon server.js
```

Server starts at: http://localhost:5000

Test it:
```
GET http://localhost:5000/api/employees
```

---

## Step 4 — Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

App opens at: http://localhost:3000

---

## API Reference

| Method | Endpoint                          | Description                    |
|--------|-----------------------------------|--------------------------------|
| GET    | /api/employees                    | Get all employees              |
| GET    | /api/employees?search=alice       | Search by name or city         |
| GET    | /api/employees?department=HR      | Filter by department           |
| GET    | /api/employees?sortBy=salary&order=DESC | Sort results              |
| GET    | /api/employees/:id                | Get single employee            |
| POST   | /api/employees                    | Create new employee            |
| PUT    | /api/employees/:id                | Update employee                |
| DELETE | /api/employees/:id                | Delete employee                |
| GET    | /api/employees/meta/departments   | List all departments           |

### POST / PUT Body (JSON)
```json
{
  "name": "Alice Johnson",
  "age": 29,
  "department": "Engineering",
  "salary": 85000,
  "city": "New York"
}
```

---

## Features

- **CRUD** — Create, Read, Update, Delete employees
- **Search** — Filter by name or city (live)
- **Department filter** — Dropdown populated from DB
- **Sort** — Click column headers or toolbar buttons (Salary / Age, ASC/DESC)
- **Stats bar** — Employee count + average salary
- **Validation** — Both client-side and server-side
- **Modal forms** — Clean overlay forms for Add/Edit
- **Responsive** — Works on mobile screens

---

## Troubleshooting

**MySQL connection refused**
- Ensure MySQL service is running: `sudo service mysql start`
- Check credentials in `backend/db.js`

**CORS errors**
- The backend already has `cors()` middleware. Ensure the backend is running on port 5000.

**Port already in use**
- Backend: change `PORT` in `server.js`
- Frontend: React will prompt you to use another port automatically

**npm not found**
- Install Node.js from https://nodejs.org (includes npm)
