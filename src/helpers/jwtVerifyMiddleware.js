// import packages and JWT config
const jwt = require("jsonwebtoken");
const config = require("./jwtConfig");

// JWT verify middleware
module.exports = (req, res, next) => {
    // access the jtw token from the HTTP headers
    let token = req.headers["x-access-token"];

    // if token exists, verify it.
    if (token) {
        // JWT verify
        jwt.verify(
            token,
            config.secretKey,
            {
                algorithm: config.algorithm,
            },
            function (err, decoded) {
                // if error during decoding of token, return error (401)
                if (err) {
                    return res.status(401).send({
                        message: "Unauthorised access!",
                    });
                }

                // else attach decoded user info to the request object
                req.user = decoded;

                // proceed with next
                next();
            }
        );
    } else {
        // if token does not exist in request headers, return 403
        return res.status(403).send({
            message: "Forbidden access!",
        });
    }
};
