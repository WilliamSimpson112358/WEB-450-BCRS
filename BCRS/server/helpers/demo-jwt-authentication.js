// const expressJwt = require('express-jwt');
// const config = require('../config.json');
// const userService = require('../services/demo-user.service');

// module.exports = jwt;

// function jwt() {
//     const secret = config.secret;
//     return expressJwt({ secret, isRevoked }).unless({
//         path: [
//             // public routes that don't require authentication
//             '/users/authenticate',
//             '/users/register',
//             '/api',
//             '/'
//         ]
//     });
// }

// async function isRevoked(req, payload, done) {
//     const user = await userService.getById(payload.sub);

//     // revoke token if user no longer exists due to expiration or other
//     if (!user) {
//         return done(null, true);
//     }

//     done();
// };