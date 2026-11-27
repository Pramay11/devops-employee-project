
import { useEffect, useState } from "react";
import {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} from "./services/api";

import "./App.css";

function App() {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [salary, setSalary] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEmployees = async () => {
        try {
            setError("");
            const response = await getEmployees();
            setEmployees(response.data);
        } catch (err) {
            setError("Unable to load employees. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !department.trim() ||
            !Number.isFinite(Number(salary)) || Number(salary) <= 0) {
            setError("Enter valid employee details.");
            return;
        }

        const employee = {
            name: name.trim(),
            department: department.trim(),
            salary: Number(salary)
        };

        try {
            if (editingId) {
                await updateEmployee(editingId, employee);
            } else {
                await addEmployee(employee);
            }

            setName("");
            setDepartment("");
            setSalary("");
            setEditingId(null);
            await fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed.");
        }
    };

    const handleEdit = (employee) => {
        setName(employee.name);
        setDepartment(employee.department);
        setSalary(String(employee.salary));
        setEditingId(employee._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this employee?")) return;

        try {
            await deleteEmployee(id);
            await fetchEmployees();
        } catch (err) {
            setError("Unable to delete employee.");
        }
    };

    const cancelEdit = () => {
        setName("");
        setDepartment("");
        setSalary("");
        setEditingId(null);
        setError("");
    };

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>Employee Management</h1>
                    <p>Manage your organization's workforce</p>
                </div>
                <span className="status">System Online</span>
            </header>

            <main className="container">
                <section className="stats">
                    <div className="stat-card">
                        <h3>Total Employees</h3>
                        <p>{employees.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Departments</h3>
                        <p>{new Set(employees.map(e => e.department)).size}</p>
                    </div>
                </section>

                <section className="form-card">
                    <h2>{editingId ? "Update Employee" : "Add Employee"}</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            placeholder="Employee Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />

                        <input
                            placeholder="Department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            required
                        />

                        <input
                            type="number"
                            placeholder="Salary"
                            value={salary}
                            onChange={e => setSalary(e.target.value)}
                            min="1"
                            required
                        />

                        <button type="submit">
                            {editingId ? "Update Employee" : "Add Employee"}
                        </button>

                        {editingId && (
                            <button type="button" onClick={cancelEdit}>
                                Cancel
                            </button>
                        )}
                    </form>

                    {error && <p className="error">{error}</p>}
                </section>

                <section className="table-card">
                    <h2>Employee Records</h2>

                    {loading ? (
                        <p>Loading employees...</p>
                    ) : employees.length === 0 ? (
                        <p>No employees found.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Salary</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee._id}>
                                            <td>{employee.name}</td>
                                            <td>{employee.department}</td>
                                            <td>₹{employee.salary.toLocaleString("en-IN")}</td>
                                            <td>
                                                <button onClick={() => handleEdit(employee)}>
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete"
                                                    onClick={() => handleDelete(employee._id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
