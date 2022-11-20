const jwt = require("jsonwebtoken");
const config = require("../config");

const verifyToken = (request, response, next) => {
    const authToken = request.headers.token;
    if (authToken) {
        jwt.verify(authToken, config.JWT_SEC_KEY, (error, user) => {
            if (error) {
                return response.status(403).json("You are not authenticated.");
            }
            request.user = user;
            next();
        });
    } else {
        return response.status(401).json("You are not authenticated.");
    }
}

const verifyTokenAndAuthorization = (request, response, next) => {
    verifyToken(request, response, () => {
        if (request.user.id === request.params.id || request.user.role === 'admin') {
            next()
        } else {
            return response.status(403).json("You are not allowed.")
        }
    });
}

const verifyTokenAndAdmin = (request, response, next) => {
    verifyToken(request, response, () => {
        if (request.user.role === 'admin') {
            next()
        } else {
            return response.status(403).json("You are not allowed.")
        }
    });
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
