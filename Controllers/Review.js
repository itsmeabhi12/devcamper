const asyncMiddleware = require("../middlewares/asyncHandler");
const reviwModel = require("../Models/Reviews");
const bootcampModel = require("../Models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");

const getReviews = asyncMiddleware(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await reviwModel.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      sucess: true,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advanceResult);
  }
});

//@decs : Get a review
//@route : GET /api/v1/reviews/:id
//@acess : public
const getReview = asyncMiddleware(async (req, res, next) => {
  const review = await reviwModel.findById(req.params.id);
  if (!review) {
    throw ErrorResponse(" Review Not FOund", 404);
  }
  res.status(200).json({
    sucess: true,
    data: review,
  });
});

//@decs : Create review
//@route : POST /api/v1/bootcamps/:bootcampId/review
//@acess : private

const createReview = asyncMiddleware(async (req, res, next) => {
  (req.body.bootcamp = req.params.bootcampId), (req.body.user = req.user._id);

  const bootcamp = bootcampModel.findById(req.params.bootcampId);
  if (!bootcamp) {
    throw new ErrorResponse("No Boot Camp Exists", 404);
  }

  const review = await reviwModel.create(req.body);

  res.status(200).json({
    sucess: true,
    data: review,
  });
});

//@decs : Update review
//@route : PUT /api/v1/reviews/:id
//@acess : private

const updateReview = asyncMiddleware(async (req, res, next) => {
  let review = await reviwModel.findById(req.params.id);

  if (!review) {
    throw ErrorResponse("No Review Exists", 404);
  }

  console.log(review._id.toString());
  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("You don't own this resources", 401);
  }

  review = await reviwModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    sucess: true,
    data: review,
  });
});

//@decs : Delete review
//@route : Delete /api/v1/reviews/:id
//@acess : private

const deleteReview = asyncMiddleware(async (req, res, next) => {
  const review = await reviwModel.findById(req.params.id);

  if (!review) {
    throw new ErrorResponse("No Review Exists", 404);
  }

  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    throw new ErrorResponse("You don't own this resources", 401);
  }

  await review.remove();

  res.status(204).json({
    sucess: true,
    data: review,
  });
});

module.exports.deleteReview = deleteReview;
module.exports.updateReview = updateReview;
module.exports.createReview = createReview;
module.exports.getReviews = getReviews;
module.exports.getReview = getReview;
