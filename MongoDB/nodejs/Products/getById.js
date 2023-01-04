const { default: mongoose } = require("mongoose");
const { Product } = require("../../../simple-example/models");
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e4d7882c8e087901b8ba";
  Product.findById(id)
    .populate("category")
    .populate("supplier")
    .then((result) => {
      console.log(result);
    });
} catch (err) {
  console.log(err);
}
