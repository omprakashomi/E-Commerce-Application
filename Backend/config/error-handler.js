function errorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).send('User is not authorized!');
    }
    return res.status(500).json(err);
}
module.exports = errorHandler;