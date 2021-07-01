const bootcampModel = require("../Models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncMiddleware = require("../middlewares/asyncHandler");
const mapquest = require('../utils/GeoCoder');
const courseModel = require("../Models/Courses");
const path = require('path');
const user = require("../Models/user");

//@desc: Get All BootCamps
//@route: GET /api/v1/bootcamps
//@acess : public
const getBootCamps = asyncMiddleware(async (req, res, next) => {
  
  res.status(200).json(res.advanceResult);
  
});

//@desc:Get one bootcamo
//@route: GET /api/v1/bootcamps/:id
//acess: public
const getBootCamp = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const data = await bootcampModel.findOne({ _id: id }).populate({
    path : 'courses',
    model : courseModel
  });
  if (!data) {
    throw new ErrorResponse("Data Not Found", 404);
  }
  res.status(200).json({ message: `Sucess`, data: data });
});

//@desc:Create a bootcamp
//@route : POST /api/v1/bootcamps
//@acess : private
const createBootCamp = asyncMiddleware(async (req, res, next) => {
  const data = req.body;
  req.body.user = req.user.id;
 
  const bootcampofuser = await bootcampModel.findOne({user:req.user.id});

  if(bootcampofuser && req.user.role != 'admin'){
    throw new ErrorResponse("You  Already Have One Bootcamp Created",400)
  }

  const bootcamp = await bootcampModel.create(data);
  res.status(201).json({ message: "BootCamp Created", data: bootcamp });
});

//@desc : Update a  bootcamp
//@route : PUT /api/v1/bootcamps/:id
//@acess : private
const updateBootCamp = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  const bootcamp = await bootcampModel.findById(id);

  if (!bootcamp) {
    throw new ErrorResponse("Data Not Found", 404);
  }
   
  //only a  admin & user that owns  this  bootcamp can  update it 
  if(bootcamp.user.toString() !== req.user.id && req.user.role != 'admin'){
    throw new ErrorResponse(`user ${req.user.id}  cannot  update  this Bootcamp`,403)
  }

  const updatedBootcamp = await bootcampModel.findByIdAndUpdate(
    { _id: id },
    data,
    { new: true, runValidators: true }
  );
  
  res.status(200).json({ message: `BootCamp Updated`, data: updatedBootcamp });
});

//@desc : Delete a bootcamp
//@route : DELETE /api/v1/bootcamp/:id
//@acess: private
const deleteBootCamp = asyncMiddleware(async (req, res, next) => {
  const { id } = req.params;
  const data = await bootcampModel.findById(id);
  if (!data) {
    throw new ErrorResponse("Data Not Found", 404);
  }

  //only a  admin & user that owns  this  bootcamp can  delete it 
  if(data.user.toString() !== req.user.id && req.user.role != 'admin'){
    throw new ErrorResponse(`user ${req.user.id}  cannot  delete  this Bootcamp`,403)
  };

 await data.remove();
  res.status(204).json({ message: `Bootcamp deleted ${id}` });
});

//@desc: GetBootcamps by Radius
//@route: GET api/v1/bootcamps/:zipcode/:distance
//@acess: public

const getBootcampsByRadius= asyncMiddleware(async(req,res,next)=>{
  const {zipcode , distance } = req.params; 
 
  const data = await mapquest.geocode(zipcode);
  const lon = data[0].longitude;
  const lat = data[0].latitude;
  const Radius = distance/3963.2;

  const bootcamps = await bootcampModel.find({
    location: {
       $geoWithin: { $centerSphere: [ [ lat, lon ], Radius ] }
    }
 });


  res.status(200).json({
    message:"Sucess",
    count :  bootcamps.length,
    data: bootcamps
  })

});

//@desc: Upload a File For Bootcamp
//@route : PUT api/v1/bootcamps/:id/photo
//@cess : private
const uploadPhoto  = asyncMiddleware(async(req,res,next)=>{
   
  const bootcamp = await bootcampModel.findById(req.params.id);

  if(!bootcamp){
    throw new ErrorResponse('BootCamp Not Found',404);
  }
  
  //only a  admin & user that owns  this  bootcamp can  update it 
  if(data.user.toString() !== req.user.id && req.user.role != 'admin'){
    throw new ErrorResponse(`user ${req.user.id}  cannot  update  this Bootcamp`,403)
  };


  if(!req.files){
    throw new ErrorResponse('Please select a file',400);
  }

  const file  =  req.files.file;
   
  if(!file.mimetype.startsWith('image/')){
     throw new ErrorResponse('Invalid File Selected Select a image file',400);
  }

  if(file.size>process.env.FILE_SIZE){
    throw new ErrorResponse('File size should be less than 1MB',400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}` 
  console.log(file);

  file.mv(`${process.env.FILE_PATH}/${file.name}`,async (err)=>{
    if(err){
      throw ErrorResponse('Somethig Went Wrong ' , 500);
    }
  });

  await bootcampModel.findByIdAndUpdate(req.params.id,{
    "photo": file.name
  });

  res.status(200).json({
    message:"Sucessfully Added",
    data :file.name
  });

});

module.exports.uploadPhoto = uploadPhoto;
module.exports.getBootcampsByRadius = getBootcampsByRadius;
module.exports.getBootCamp = getBootCamp;
module.exports.getBootCamps = getBootCamps;
module.exports.createBootCamp = createBootCamp;
module.exports.updateBootCamp = updateBootCamp;
module.exports.deleteBootCamp = deleteBootCamp;
