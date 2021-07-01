const asyncMiddleare = require("./asyncHandler");

const advanceResult = (model, populate) =>
  asyncMiddleare(async (req, res, next) => {
    const query = { ...req.query };

    //field  thar are to be  removed (i.e projection fields)
    const toberemovedField = ["select", "sort", "page", "limit"];

    toberemovedField.map((field) => delete query[field]);

    //adding $ sign
    let queryStr = JSON.stringify(query).replace(
      /\b(gt|gte|lt|lte|in|ne|nin)\b/g,
      (match) => `$${match}`
    );

    const finalQuery = model.find(JSON.parse(queryStr)).populate(populate);

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const statIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();
    finalQuery.skip(statIndex).limit(limit);

    //pagination next and prev logic
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (statIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    if (req.query.select) {
      finalQuery.select(req.query.select.split(",").join(" "));
    }

    if (req.query.sort) {
      finalQuery.sort(req.query.sort);
    }

    const data = await finalQuery;

    res.advanceResult = {
      message: "Sucess",
      pagination,
      length: data.length,
      data: data,
    };

    next();
  });

module.exports = advanceResult;
