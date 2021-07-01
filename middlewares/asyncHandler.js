const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//asyncMiddleare will be  called at route(route.get('/',asyncHandler(fn)))  so  it must return a function with three parameter
//fn is passed before it is called to route  and  fn will be called with 3 parameter that you will get from route
// fn is simply a function with 3 parameter
//this is a middleware between  route and  controllers
// which simply means  i accept  3 parameter from route and pass those parameter to controllers (imp point)
module.exports = asyncMiddleware;
