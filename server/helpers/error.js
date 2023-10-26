const createError = require('http-errors');


module.exports = class CustomErrors extends Error {
    constructor(message, status) {
        super(message)
        if (isNaN(Number(status))) {
            status = 500;
        }
        this.name = createError(status).name;
        this.message = message;
        this.status = status;
    }
}