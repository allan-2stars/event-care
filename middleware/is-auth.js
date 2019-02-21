const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    //return res.status(401).json({ message: 'Not authenticated.' });
    req.isAuth = false;
    return next();
  }
  // Beaer xxx
  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, keys.secretOrPrivateKey);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  req.isAuth = true;
  // decodedToken contains userId and email as
  // when login, stored into token
  req.userId = decodedToken.userId;
  next();
};
