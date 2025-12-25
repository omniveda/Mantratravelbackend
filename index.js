require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const database = require("./config/database.config");
const { cloudinaryConnect } = require("./config/cloudinary");

// Validate environment variables
if (
    process.env.NODE_ENV === "production" &&
    (!process.env.JWT_SECRET || process.env.JWT_SECRET === "secret")
) {
    console.error(
        "FATAL ERROR: JWT_SECRET not properly configured in production"
    );
    process.exit(1);
}

// Database connection
database.connect();

// Enhanced CORS configuration
const corsOptions = {
    origin: ["http://localhost:3000"], // Allow all origins for troubleshooting
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "x-auth-token",
        "X-Requested-With",
        "Accept",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.options("*", cors(corsOptions));

// Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Trust proxy in production
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// File upload middleware
app.use(
    fileUpload({
        useTempFiles: true,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
        abortOnLimit: true,
        responseOnLimit: "File size too large. Max 5MB allowed",
        parseNested: true,
    })
);

// Cloudinary connection
cloudinaryConnect();

// API Routes
const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/blogs", require("./routes/Blogs.Routes"));
apiRouter.use("/news", require("./routes/News.Routes"));
apiRouter.use("/auth", require("./routes/Auth.Routes"));
apiRouter.use("/upload", require("./routes/Upload.Routes"));
apiRouter.use("/products", require("./routes/Product.Routes"));

// Health check endpoint
apiRouter.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

// Serve static files in production
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "production ") {
    // Set static folder
    app.use(express.static(path.join(__dirname, "frontend/build")));

    // Handle React routing, return all requests to React app
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    });
} else {
    // Root endpoint for development
    app.get("/", (req, res) => {
        res.json({
            status: "success",
            message: "Casino Backend API",
            version: "1.0.0",
            environment: process.env.NODE_ENV || "development",
            endpoints: {
                docs: "/api-docs",
                blogs: "/api/blogs",
                auth: "/api/auth",
            },
        });
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);

    const response = {
        success: false,
        message: "Internal Server Error",
    };

    if (process.env.NODE_ENV === "development") {
        response.error = err.message;
        response.stack = err.stack;
    }

    res.status(500).json(response);
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`
  Server running in ${process.env.NODE_ENV || "development"} mode
  Listening on port ${PORT}
  CORS whitelist: ${corsOptions.origin.join(", ")}
  `);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});
