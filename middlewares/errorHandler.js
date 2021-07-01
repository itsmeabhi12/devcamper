const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  var error = err;
  if (err.name === "CastError") {
    error = new ErrorResponse("Resources Not Found", 404);
  }

  //Mongodb Duplication error
  if (err.code === 11000) {
    error = new ErrorResponse("Resource Already  Exist", 400);
  }

  if (err.name === "ValidationError") {
    error = new ErrorResponse(
      Object.values(err.errors).map((error) => error.message), //Object.values(err.errors).map((x) => x.properties.message)
      400
    );
  }

  res
    .status(error.statuscode || 500)
    .json({ message: error.message || "internal Server Error", data: null });
};

module.exports = errorHandler;
