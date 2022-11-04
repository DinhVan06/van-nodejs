const { default: mongoose } = require("mongoose");

const { Employees } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "6363e108e94c56a392dc107f";
  const dataEmployees = {
    firstName: "New firstName Employees",
    lastName: "new lastName Employees",
    phoneNumber: "0456789345",
    address: "Da Nang",
    email: "Employees@gmail.com",
    birthday: "01/01/1995",
  };
  Employees.findByIdAndUpdate(id, dataEmployees, { new: true }).then(
    (result) => {
      console.log(result);
    }
  );
} catch (err) {
  console.log.apply(err);
}
