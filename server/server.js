const express = require("express");
const mongoose = require("mongoose");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const adaptiveRoutes = require("./routes/adaptiveRoutes");
const questionRoutes = require("./routes/questionRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/student", studentRoutes);
app.use("/api/student/dashboard", dashboardRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/adaptive", adaptiveRoutes);
app.use("/api/questions", questionRoutes);


const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EduAdapt AI Backend is running 🚀"
    });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully ✅");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed ❌");
        console.error(error.message);
    });