import express, { type Request, type Response, type NextFunction } from "express";
import dotenv from "dotenv";
import { Sequelize, DataTypes } from "sequelize";
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
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

/*------------User registration and login logic-------------*/

export const validateRegistration = [
    body('password')
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage('Password must be at least 12 chars long...'),

    // Explicitly type the req, res, and next parameters
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// User registration endpoint
app.post("/api/register", validateRegistration, async (req: Request, res: Response) => {
    try {
        // Extract data from req.body
        const { username, password } = req.body;
        const newUser = await User.create({ username, password });
        res.status(201).json({
            username: newUser.get('username')
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Rate limiting for login attempts
export const loginLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 5, // Limit each IP to 5 failed login attempts per window
    message: 'Too many login attempts from this IP, please try again after 2 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});


// Start Express listener server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
