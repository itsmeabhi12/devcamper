const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./configs/config.env" });
const bootcampModel = require("./Models/Bootcamp");
const courseModel = require("./Models/Courses");
const userModel = require("./Models/user");
const reviewModel = require("./Models/Reviews");

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/data/bootcamps.json`)
);
const courses = JSON.parse(fs.readFileSync(`${__dirname}/data/courses.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`));

const populateDB = async () => {
  await bootcampModel.create(bootcamps);
  await courseModel.create(courses);
  await userModel.create(users);
  await reviewModel.create(reviews);
};

const deleteDB = async () => {
  await bootcampModel.deleteMany();
  await courseModel.deleteMany();
  await userModel.deleteMany();
  await reviewModel.deleteMany();
};

if (process.argv[2] === "-i") {
  populateDB();
  console.log("inserted");
} else if (process.argv[2] === "-d") {
  deleteDB();
  console.log("Deleted");
} else if (process.argv[2] == "-t") {
  console.log(bootcamps);
}
