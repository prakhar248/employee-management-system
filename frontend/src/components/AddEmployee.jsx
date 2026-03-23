import React, { useState } from "react";
import { createEmployee } from "../api/employeeApi";

const INITIAL_FORM = {
  name: "",
  age: "",
  department: "",
  salary: "",
  city: "",
};

function AddEmployee({ onSuccess, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.age || isNaN(form.age) || form.age <= 0 || form.age > 120)
      return "Please enter a valid age (1–120).";
    if (!form.department.trim()) return "Department is required.";
    if (!form.salary || isNaN(form.salary) || form.salary < 0)
      return "Please enter a valid salary.";
    if (!form.city.trim()) return "City is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    setLoading(true);
    try {
      await createEmployee(form);
      setForm(INITIAL_FORM);
      onSuccess("Employee added successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Employee</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="emp-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Alice Johnson"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="e.g. 30"
                value={form.age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="e.g. New York"
                value={form.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Salary (₹)</label>
            <input
              type="number"
              name="salary"
              placeholder="e.g. 75000"
              value={form.salary}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployee;
