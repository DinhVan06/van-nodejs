const { default: mongoose } = require("mongoose");

const { Order } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e8bc0fcb95045de55112";
  const data = {
    createdDate: "02/04/2022",
    shippedDate: "05/11/2022",
    status: "COMPLETED",
    description: "description order",
    shippingAddress: "Da Nang",
    paymentType: "CREDIT CARD",
    customerId: "6363ce7c16173a2d8e280049",
    employeeId: "6363e108e94c56a392dc107f",
  };
  Order.findByIdAndUpdate(id, data, {
    new: true,
  }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
