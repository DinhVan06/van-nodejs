const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models");

mongoose.connect("mongodb://localhost:27017/Test");
try {
  const dataSupplier = {
    name: "supplied1",
    email: "aaa@gmail.com",
    phoneNumber: "0334446569",
    address: "aaaaaa",
  };
  const newItem = new Supplier(dataSupplier);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
