const { default: mongoose } = require("mongoose");
const { Employees } = require("../models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  Employees.find().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
