const coursesModel = require('../Models/Courses');
const bootcampModel = require('../Models/Bootcamp');
const asyncMiddleware = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const user = require('../Models/user');


//@desc : Get all Courses
//@route : GET api/v1/bootcamps/:bootcampId/courses
//@route : GET api/v1/courses
//@acess :public

const getCourses = asyncMiddleware(async(req,res,next)=>{

 let query;
if(req.params.bootcampId){
    query = coursesModel.find({bootcamp:req.params.bootcampId});
    const data = await query;
   res.status(200).json({message : "Sucess",count:data.length,data:data});

}else{
    res.status(200).json(res.advanceResult);

}

 
});


//@desc : Add a Courses to particular bootcamp
//@route : POST api/v1/bootcamps/:bootcampId/courses
//@acess : Private
const addCourse  = asyncMiddleware(async(req,res,next)=>{
    
req.body.bootcamp = req.params.bootcampId;
req.body.user = req.user.id;
const bootcamp = await bootcampModel.findById(req.params.bootcampId,'name user')
if(!bootcamp){
    throw new ErrorResponse('No Such BootCamp Exist',404)
}
if(bootcamp.user.toString() !== req.user.id && req.user.role !='admin'){

    throw new ErrorResponse(`${req.user.id} dosent own this bootcamp so can\'t add a course to it`,403);
}


const course = await coursesModel.create(req.body);

res.status(201).json({
message : 'Sucessfully added',
data : course
});

});

//@desc : GET Bootcamp by id
//@route : api/v1/courses/:id

const getCourse = asyncMiddleware(async(req,res,next)=>{
    const course = await coursesModel.findById(req.params.id);
    if(!course){
        throw new ErrorResponse('No Such Course Exist',404)
    }
    res.status(200).json({
        message :'Sucess',
        data :  course
    })
});

//@desc : Update Course
//@route : PUT /api/v1/courses/:id
//@acess : Private
const updateCourse = asyncMiddleware(async(req,res,next)=>{

     const course = await coursesModel.findById(req.params.id);
     if(!course){
        throw new ErrorResponse('No Such Course Exist',404)
    }

    if(course.user.toString() !== req.user.id && req.user.role != 'admin'){
        throw new ErrorResponse(`user ${req.user.id} cannot upate this course`);
    }

    const updatedCourse  =await coursesModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
     
    
    
    res.status(200).json({
        message : 'Sucess',
        data : updatedCourse
    });
});

const deleteCourse = asyncMiddleware(async(req,res,next)=>{

    const deletepost =  await coursesModel.findById(req.params.id);
    if(!deletepost){
        throw new ErrorResponse('No Such Course Exists',404);
    }
    if(deletepost.user.toString() !== req.user.id && req.user.role != 'admin'){
        throw new ErrorResponse(`user ${req.user.id} cannot delete this course`);
    }
     
    await deletepost.remove();
    res.status(204).json({message:'Deleted'});
});

module.exports.deleteCourse = deleteCourse;
module.exports.updateCourse = updateCourse;
module.exports.getCourse = getCourse;
module.exports.addCourse = addCourse;
module.exports.getCourses = getCourses;