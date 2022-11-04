const { default: mongoose } = require("mongoose");

const { Order } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const dataOrder = {
    createdDate: "01/11/2022",
    shippedDate: "04/11/2022",
    status: "WAITING",
    description: "description order",
    shippingAddress: "Da Nang",
    paymentType: "CASH",
    customerId: "6363ce7c16173a2d8e280049",
    employeeId: "6363e108e94c56a392dc107f",
  };

  const newItem = new Order(dataOrder);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
