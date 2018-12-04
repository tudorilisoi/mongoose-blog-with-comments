const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

// Assigns the Strategy export to the name JwtStrategy using object destructuring
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Assigning_to_new_variable_names
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const UserModel = require('../user/userModel');
const { JWT_SECRET } = require('../../../config');

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email', //since e-mails are unique we'll use those as an identifier
    passwordField: 'password',
  },
  async (email, password, callback) => {
    const user = await UserModel.findOne({ email })
    if (user) {
      const validCredentials = await user.validatePassword(password);
      if (validCredentials) {
        return callback(null, user)
      } else {
        throw new Error('INVALID_PASSWORD')
      }
    } else {
      throw new Error('NO_SUCH_EMAIL')
    }
  });

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    // Only allow HS256 tokens - the same as the ones we issue
    algorithms: ['HS256']
  },
  (payload, done) => {
    done(null, payload.user);
  }
);

const localAuthMiddleware = passport.authenticate('local', { session: false });
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

module.exports = {
  jwtAuthMiddleware,
  localAuthMiddleware,

  //these are to be used only in tests
  localStrategy,
  jwtStrategy
};
