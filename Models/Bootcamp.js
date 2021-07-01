const mongoose = require("mongoose");
const slugify = require("slugify");
const mapquest = require("../utils/GeoCoder");
const courseModel = require("./Courses")

const Schema = mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name cannot be Empty"],
    unique: true,
    trim: true,
    maxLength: [40, "Name is Too Long it should be below {VALUE} character"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Discription is empty"],
    maxLength: [
      500,
      "Discription is too long & it should be below {VALUE} characters",
    ],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Enter a valid website",
    ],
  },
  phone: {
    type: String,
    maxLength: [20, "Phone no. cannot be more than 20 digtis"],
  },
  email: {
    type: String,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Not Valid Email"],
  },
  address: {
    type: String,
    required: [true, "Address is Required"],
  },
  location: {
    //GeoJSON
    type: {
      type: String,
      enum: ["Point"],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: ["true", "Required Field"],
    enum: {
      values: ["Mobile Development", "Web Development", "UI/UX", "Business","Data Science"],
      message: "{VALUE} is not Supported",
    },
  },
  averageRating: {
    type: Number,
    min: [1, "Range is 1-10"],
    max: [10, "Range is 1-10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-pic.png",
  },
  jobGurantee: {
    type: Boolean,
    default: false,
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  user:{
    type : mongoose.Schema.ObjectId,
    ref:'User',
    require:true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  } 
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

Schema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

Schema.pre("save", async function (next) {
  try {
    const data = await mapquest.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [data[0].latitude, data[0].longitude],
      formattedAddress: data[0].formattedAddress,
      street: data[0].street,
      city: data[0].city,
      state: data[0].state,
      zipcode: data[0].zipcode,
      country: data[0].country,
    };
    next();
  } catch (e) {
    console.log(e);
    next();
  }
});

Schema.pre('remove',async function(){
  await this.model('Course').deleteMany({bootcamp:this._id});
  //await courseModel.deleteMany({bootcamo:this._id})
});

Schema.virtual('courses',{
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

module.exports = mongoose.model("BootCamp", Schema);
