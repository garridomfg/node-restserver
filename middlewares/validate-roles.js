const { request, response } = require("express")

const isProfessionalRole = (req = request, res = response, next) => {
    
    if (!req.user) {
        return res.status(500).json({
            msg: 'The token need to be validate first'
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${name} is not Admin`,
        });
    }

    next();
}

module.exports = {
    isProfessionalRole,
}