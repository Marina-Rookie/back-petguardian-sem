const bcrypt = require('bcrypt');

const encriptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const decryptPassword = async (password, passwordUser) => {
    return await bcrypt.compare(password, passwordUser);
}

module.exports = { encriptPassword, decryptPassword };