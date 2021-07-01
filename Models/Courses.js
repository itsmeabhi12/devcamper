const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "Title is Required"],
  },
  description: {
    type: String,
    require: [true, "Description cannot be empty"],
  },
  weeks: {
    type: Number,
    require: [true, "no.of Weeks is required"],
  },
  tution: {
    type: Number,
    require: [true, "TutionFee is required"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Minimum Skill's is required"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "bootcamp",
    required: [true, "Bootcamp for a course is required"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "User cannot be null"],
  },
});
Schema.statics.calcualteAvgCost = async function (bootcampId) {
  //this -> currentModel of schema eg :- coursemodel
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tution" },
      },
    },
  ]);
  await this.model("BootCamp").findByIdAndUpdate(bootcampId, {
    averageCost: obj[0].averageCost,
  });
};

Schema.post("save", function () {
  //this represent istance of model and  this.constructor represent model
  console.log(this.constructor);
  this.constructor.calcualteAvgCost(this.bootcamp);
});

Schema.pre("remove", function () {
  this.model("Course").calcualteAvgCost(this.bootcamp);
});

module.exports = mongoose.model("Course", Schema);
