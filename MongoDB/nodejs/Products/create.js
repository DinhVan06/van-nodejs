const { default: mongoose } = require("mongoose");
const { Product } = require("../models");

mongoose.connect("mongodb://localhost:27017/Test");
try {
  const dataProduct = {
    name: "name product",
    price: 300000,
    discount: 30,
    stock: 25,
    categoryId: "63629c61f8726d031b3e3614",
    supplierId: "63629d887cce6fe7456de370",
    description: "product",
  };
  const newItem = new Product(dataProduct);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
