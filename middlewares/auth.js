const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({
      success: false,
      message: "Access denied: No token provided",
    });
  }

  // Verify token
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret, {
      clockTolerance: 30,
    });

    // Attach user to request
    req.user = decoded.user;

    // Check for admin routes - simplified: if the route is intended for admin, check isAdmin
    // We can check if the current route is part of the admin management subroutes or if the operation is privileged
    // For now, let's look at the original logic but make it more reliable
    const isApiAdminRoute = req.originalUrl && (req.originalUrl.includes("/instagram") || req.originalUrl.includes("/blogs") || req.originalUrl.includes("/news") || req.originalUrl.includes("/shop"));

    // If it's a mutation (POST, PUT, DELETE) on these routes, require admin
    if (["POST", "PUT", "DELETE"].includes(req.method) && isApiAdminRoute) {
      if (!decoded.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Access denied: Admin privileges required",
        });
      }
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.name, "-", err.message);
    res.status(401).json({
      success: false,
      message: "Authentication failed: Invalid or expired token",
      error: err.message
    });
  }
};
