const jwt = require('jsonwebtoken');
const { promisify } = require('util');

async function validateJWT(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.send({code: 401, error: "authorization header not found"});
    }

    const [, token] = authorization.split(' ');

    try {
        await promisify(jwt.verify)(token, process.env.AUTH_SECRET);

        return next();
    } catch (err) {
        return res.send({code: 403, error: "Expired login!"});
    }
}

module.exports = validateJWT;