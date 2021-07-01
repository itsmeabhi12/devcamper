const asyncMiddleware = require("../middlewares/asyncHandler");
const userModel = require("../Models/user");
const ErrorResponse = require("../utils/ErrorResponse");

const getUsers = asyncMiddleware(async (req, res, next) => {
  res.status(200).json(res.advanceResult);
});

//@desc : Get a User
//@route GET api/v1/user/:id
//@acess : Admin

const getUser = asyncMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not Found", 404);
  }

  res.status(200).json({
    sucess: true,
    data: user,
  });
});

//@desc : Update a User
//@route PUT api/v1/user/:id
//@acess : Admin

const updateUser = asyncMiddleware(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new ErrorResponse("User not Found", 404);
  }

  res.status(200).json({
    sucess: true,
    data: user,
  });
});

//@desc : Update a User
//@route DELETE api/v1/user/:id
//@acess : Admin

const deleteUser = asyncMiddleware(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new ErrorResponse("User not Found", 404);
  }

  res.status(204).json({
    sucess: true,
    data: user,
  });
});

const createUser = asyncMiddleware(async (req, res, next) => {
  const user = await userModel.create(req.body);

  res.status(201).json({
    sucess: true,
    data: user,
  });
});

module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
