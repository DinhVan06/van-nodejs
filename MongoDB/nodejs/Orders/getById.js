const { default: mongoose } = require("mongoose");

const { Order } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e8bc0fcb95045de55112";
  Order.findById(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
