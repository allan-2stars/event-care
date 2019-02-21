const bcrypt = require('bcrypt');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const secretString = require('../../config/keys').secretOrPrivateKey;

module.exports = {
  createUser: args => {
    const { email, password } = args.userInput;
    // use return to wait for the correct result
    return User.findOne({ email })
      .then(user => {
        if (user) {
          throw new Error('User existes.');
        }
        return bcrypt.hash(password, 12);
      })

      .then(hashedPassword => {
        const user = new User({
          email: email,
          password: hashedPassword
        });
        return user.save();
      })
      .then(result => {
        return { ...result._doc, password: null, _id: result.id };
      })
      .catch(err => {
        throw err;
      });
  },

  // login
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    // for dev env give different hint for email/password incorrect
    if (!user) {
      throw new Error('User not exist.');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect');
    }

    // generate a token by userId and email
    // stored userId and email into token.
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      // the secret string
      secretString,
      // setup token expired time
      { expiresIn: '2h' }
    );

    return { userId: user.id, token: token, tokenExpiration: 2 };
  }
};
