const { default: mongoose } = require("mongoose");
const { Product } = require("../models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e4d7882c8e087901b8ba";
  Product.findByIdAndDelete(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
