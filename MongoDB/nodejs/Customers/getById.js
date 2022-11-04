const { default: mongoose } = require("mongoose");
const { Customer } = require("../models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363ce7c16173a2d8e280049";
  Customer.findById(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
