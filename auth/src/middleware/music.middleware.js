const jwt = require('jsonwebtoken');

async function authArtistMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unatuthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'artist') {
      return res.status(403).json({ message: "forBiddion" });
    }

    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

async function authUserMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unatuthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ message: error.message });
  }
}

module.exports = {
  authArtistMiddleware,
  authUserMiddleware
};
