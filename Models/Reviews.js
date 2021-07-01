const mongoose = require("mongoose");
const { schema } = require("./Courses");

const Schema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Review Title is necessary"],
  },
  text: {
    type: String,
    required: [true, "Please enter a text"],
  },
  rating: {
    type: Number,
    max: 10,
    min: 1,
    required: [true, "Rating is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "BootCamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

Schema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: bootcampId,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await this.model("BootCamp").findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

Schema.post("save", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

Schema.post("remove", async function () {
  await this.constructor.getAverageRating(this.bootcamp);
});

Schema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", Schema);
