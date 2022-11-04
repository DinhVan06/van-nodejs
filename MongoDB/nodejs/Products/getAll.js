const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  Product.find()
    .populate("category")
    .then((result) => {
      console.log(result);
    });
} catch (err) {
  console.log(err);
}
