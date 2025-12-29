const jwt = require("jsonwebtoken");

async function authArtistMiddleware(req, res, next) {
  try {
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token &&req.headers.authorization &&req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(400).json({
        message: "unAuthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "forBiddion",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
}

async function authUserMiddleware(req, res, next) {
  
  try {

    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
      token = req.headers.authorization.split(" ")[1];
    }


    if (!token) {
      return res.status(401).json({
        message: "UnAuthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      message: error.message,
    });
  }
}

module.exports = {
  authArtistMiddleware,
  authUserMiddleware,
};
