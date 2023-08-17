import JwtStrategy from ('passport-jwt').Strategy;
import ExtractJwt from ('passport-jwt').ExtractJwt;
import { JWT } from ('./constants/authConstant');
import User from ('../app/models/user');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = JWT.SECRET;
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findOne(
                {
                    emails: {
                        $elemMatch: {
                            email: jwt_payload.email,
                        },
                    },
                },
                (err, user) => {
                    if (err) return done(err, false);
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                },
            );
        }),
    );
};
