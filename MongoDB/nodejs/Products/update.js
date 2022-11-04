const { default: mongoose } = require("mongoose");

const { Product } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e4d7882c8e087901b8ba";
  const dataProduct = {
    name: "new name product",
    price: 400000,
    discount: 10,
    stock: 30,
    categoryId: "63629c61f8726d031b3e3614",
    supplierId: "63629d887cce6fe7456de370",
    description: "new description product",
  };
  Product.findByIdAndUpdate(id, dataProduct, { new: true }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log.apply(err);
}
