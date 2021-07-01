const asyncMiddleware = require("./asyncHandler");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/ErrorResponse");
const userModel = require("../Models/user");

const protectRoute = asyncMiddleware(async (req, res, next) => {
  var token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new ErrorResponse("Not Authorized", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    throw new ErrorResponse("Not Authorized", 404);
  }
});

const authorized = (roles) => {
  return asyncMiddleware((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorResponse(
        `${req.user.role} are not allowes to acess this route`,
        403
      );
    }
    next();
  });
};

module.exports.authorized = authorized;
module.exports.protectRoute = protectRoute;
