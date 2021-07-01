const mongoose = require("mongoose");

const connectToDatabase = () =>
  mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:true
  });

mongoose.set('useFindAndModify', true);
module.exports = connectToDatabase;
