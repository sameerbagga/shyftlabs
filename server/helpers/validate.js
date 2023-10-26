function validateInteger(input) {
    if (input % 1 !== 0) {
        return false;
    }
    return true;
}

module.exports = { validateInteger }