import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
// eslint-disable-next-line n/no-missing-import
import initUserModel, { User } from "./models/user.js"; // Adjust path as needed

dotenv.config();

// eslint-disable-next-line sonarjs/x-powered-by
const app = express();
const PORT = 5000;

app.use(express.json());

// Initialize the database connection
const sequelize = new Sequelize(
    "dev_db",
    "dev_user",
    "dev_password",
    {
        host: 'db', // or your DB host
        dialect: 'postgres'
    }
);

app.get("/api/hello_backend", (req, res) => {
    res.json({ message: "Hello! Testing 2 This is the backend talking!" });
});

// 2. IMPORTANT: Initialize the model
// This runs User.init() inside your model file
initUserModel(sequelize, DataTypes);


app.post("/api/newUser", async (req, res) => {
    try {
        const newUser = await User.create();
        res.status(201).json({
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

// Start Express listener server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
