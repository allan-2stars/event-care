const bcrypt = require('bcrypt');
const User = require('../../models/user');

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
  }
};
