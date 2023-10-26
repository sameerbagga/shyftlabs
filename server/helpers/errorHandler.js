const CustomErrors = require('./error');

module.exports = function errorHandler(err, req, res, next) {
    if (err instanceof Error) {
        const respJson = {
            statusCode: err.status,
            name: err.name,
            errors: [
                err.message
            ]
        };
        return res.status(err.status).json(respJson);
    } else {
        const status = err.error.response?.status || 500;
        return new CustomErrors(err.error, status);
    }
}