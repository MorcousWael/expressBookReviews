const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    if (
        req.session &&
        req.session.authorization &&
        req.session.authorization.accessToken
    ) {
        const token = req.session.authorization.accessToken;
        // Verify the access token using your secret key
        jwt.verify(token, "your-secret-key", (err, user) => {
            if (!err) {
                // The token is valid; store the user information in the request object
                req.user = user;
                next();
            } else {
                // Token verification failed; send an authentication error response
                return res
                    .status(403)
                    .json({ message: "User not authenticated" });
            }
        });
    } else {
        // No session or access token found; send an authentication error response
        return res.status(403).json({ message: "User not authenticated" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
