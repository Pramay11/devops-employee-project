
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const employeeRoutes = require("./src/routes/employeeRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Employee Management System");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Employee Management API is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
