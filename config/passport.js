var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var {User} = require('../models/users');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = 'secret';
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        console.log(jwt_payload);
        User.findOne({email: jwt_payload.email}, function(err, user) {
            if (err) {
                console.log("error ocurred", err);
                return done(err, false);
            } else {
                done(null, user);
            }
        });
    }));
};