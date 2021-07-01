const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./configs/dbconnect");
const bootcampsroute = require("./Routes/BootCamp");
const courseRoute = require("./Routes/Courses");
const errorHandler = require("./middlewares/errorHandler");
const fileUpload = require("express-fileupload");
const path = require("path");
const authroute = require("./Routes/auth");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/User");
const reviewRoute = require("./Routes/Review");
dotenv.config({ path: "./configs/config.env" });
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3004;

dbConnection();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(express.json());

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(fileUpload());

app.use(cookieParser());

app.use(hpp());

app.use(helmet());

app.use(mongoSanitize());

app.use(limiter);

app.use(xss());

app.use("/api/v1/bootcamps", bootcampsroute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/auth", authroute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/reviews", reviewRoute);

app.use(errorHandler);

process.on("unhandledRejection", (err, promises) => {
  console.log(err.message);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(
    ` Server started in ${process.env.NODE_ENV} mode at port ${PORT}`
  );
});
