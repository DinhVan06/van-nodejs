const { default: mongoose } = require("mongoose");

const { Order } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  Order.find()
    .populate("customer")
    .populate("employee")
    .then((result) => {
      console.log(result);
    });
} catch (err) {
  console.log(err);
}
