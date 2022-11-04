const { default: mongoose } = require("mongoose");
const { Employees } = require("../models");

mongoose.connect("mongodb://localhost:27017/Test");
try {
  const dataEmployee = {
    firstName: "Bui Dinh",
    lastName: "Van",
    phoneNumber: "0345454543",
    address: "aaaaa",
    email: "a@gmail.com",
    birthday: "11/04/2001",
  };
  const newItem = new Employees(dataEmployee);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
