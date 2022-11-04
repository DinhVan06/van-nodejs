const { default: mongoose } = require("mongoose");
const { Supplier } = require("../models");

mongoose.connect("mongodb://localhost:27017/Test");
try {
  const id = "63629d887cce6fe7456de370";
  Supplier.findById(id).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
