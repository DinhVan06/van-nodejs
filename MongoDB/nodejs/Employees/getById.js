const { default: mongoose } = require("mongoose");
const { Employees } = require("../models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e108e94c56a392dc107f";
  Employees.findById(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
