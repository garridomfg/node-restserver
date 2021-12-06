const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise( (resolve, reject) => {
        const payload = { uid };

        jwt.sign(payload, process.env.PRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Cannot get token');
            } else {
                resolve(token);
            }
        })
    });
}

module.exports = {
    generateJWT,
}