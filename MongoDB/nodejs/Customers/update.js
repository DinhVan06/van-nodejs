const { default: mongoose } = require("mongoose");

const { Customer } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363ce7c16173a2d8e280049";
  const dataCustomer = {
    firstName: "New firstName Customer",
    lastName: "new lastName Customer",
    phoneNumber: "0456789345",
    address: "Da Nang",
    email: "Customer@gmail.com",
    birthday: "01/01/1995",
  };
  Customer.findByIdAndUpdate(id, dataCustomer, { new: true }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log.apply(err);
}
