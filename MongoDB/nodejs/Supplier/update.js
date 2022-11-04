const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models");

mongoose.connect("mongodb://localhost:27017/Test");
try {
  const id = "63629d887cce6fe7456de370";
  const dataSupplier = {
    name: "New Supplier",
    email: "bbb@gmail.com",
    phoneNumber: "0344444444",
    address: "bbbbb",
  };
  Supplier.findByIdAndUpdate(id, dataSupplier, { new: true }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
