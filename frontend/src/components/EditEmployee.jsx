import React, { useState, useEffect } from "react";
import { fetchEmployee, updateEmployee } from "../api/employeeApi";

function EditEmployee({ employeeId, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    department: "",
    salary: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Load existing employee data on mount
  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const res = await fetchEmployee(employeeId);
        const { name, age, department, salary, city } = res.data;
        setForm({ name, age, department, salary, city });
      } catch (err) {
        setError("Failed to load employee data.");
      } finally {
        setFetching(false);
      }
    };
    loadEmployee();
  }, [employeeId]);

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
      await updateEmployee(employeeId, form);
      onSuccess("Employee updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update employee.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="loading-spinner-wrap">
            <div className="spinner"></div>
            <p>Loading employee data…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Employee <span className="id-badge">#{employeeId}</span></h2>
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
                placeholder="Full Name"
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
                placeholder="Age"
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
                placeholder="Department"
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
                placeholder="City"
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
              placeholder="Salary"
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployee;
