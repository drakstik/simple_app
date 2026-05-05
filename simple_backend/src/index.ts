import express from "express";
import dotenv from "dotenv";

dotenv.config();

// eslint-disable-next-line sonarjs/x-powered-by
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/api/hello_backend", (req, res) => {
    res.json({ message: "Hello! This is the backend talking!" });
});

// Start Express listener server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});