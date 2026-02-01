const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to database
require("./config/database.config").connect();

// Cloudinary connection
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Route registration
const apiRouter = express.Router();
app.use("/api", apiRouter);

apiRouter.use("/blogs", require("./routes/Blogs.Routes"));
apiRouter.use("/news", require("./routes/News.Routes"));
apiRouter.use("/auth", require("./routes/Auth.Routes"));
apiRouter.use("/upload", require("./routes/Upload.Routes"));
apiRouter.use("/products", require("./routes/Product.Routes"));
apiRouter.use("/instagram", require("./routes/Instagram.Routes"));
apiRouter.use("/analytics", require("./routes/Analytics.Routes"));
apiRouter.use("/seo", require("./routes/SEO.Routes"));

// Health check endpoint
apiRouter.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
