const jwt = require('jsonwebtoken')

function verifyToken(token,callback) {
    jwt.verify(token,'Fizz', function (err, data) {
        if (err) {
            callback(401)
        } else {
            callback(data)
        }
    })
}

module.exports = {
    verifyToken
}