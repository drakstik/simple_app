import express from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
// eslint-disable-next-line n/no-missing-import
import initUserModel, { User } from "./models/user.js";

dotenv.config();

// eslint-disable-next-line sonarjs/x-powered-by
const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());

// Initialize the database connection
const sequelize = new Sequelize(
    process.env.DB_NAME || "dev_db",
    process.env.DB_USER || "dev_user",
    process.env.DB_PASSWORD || "dev_password",
    {
        host: process.env.DB_HOSTNAME || 'db', // or your DB host
        dialect: 'postgres'
    }
);
// 2. IMPORTANT: Initialize the model
// This runs User.init() inside your model file
initUserModel(sequelize, DataTypes);


// 3. sync your db schema without the use of migration files (only for development)
// This will sync you model changes with the db schema. Be careful with renaming tables as their
// data may be dropped. To rename tables and other complex model changes, use migration files. 
await sequelize.sync({ alter: true });

app.get("/api/hello_backend", (req, res) => {
    res.json({ message: "Hello! Testing 2 This is the backend talking!" });
});

// New User endpoint
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

app.post("/api/updateUsername", async (req, res) => {
    const { id } = req.body;
    const { username } = req.body;
    try {
        // 1. Find the user by their Primary Key (UUID)
        const user = await User.findByPk(id) as (User & { username: string | null });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // 2. Update the field
        user.username = username;

        // 3. Persist changes to the database
        await user.save();

        res.json({
            success: true,
            message: "Username updated successfully to ",
            user: user
        });
    } catch (error) {
        console.error("Update Error!:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
});

// Start Express listener server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
