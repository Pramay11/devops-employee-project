
import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const getEmployees = () => {
    return API.get("/employees");
};

export const addEmployee = (employee) => {
    return API.post("/employees", employee);
};

export const updateEmployee = (id, employee) => {
    return API.put(`/employees/${id}`, employee);
};

export const deleteEmployee = (id) => {
    return API.delete(`/employees/${id}`);
};

export default API;
