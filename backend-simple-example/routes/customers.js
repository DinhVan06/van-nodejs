const { default: mongoose } = require("mongoose");

const { Customer } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");
var express = require("express");
var router = express.Router();
// require
const { findDocuments } = require("../helpers/MongoDBHelpers");

// let dataCustomers = [
//   {
//     id: 1,
//     firstName: "Nguyen Van",
//     lastName: "A",
//     phoneNumber: 1111111111,
//     address: "abc",
//     email: "123@gmail.com",
//     birthday: "01/01/2000",
//   },
//   {
//     id: 2,
//     firstName: "Nguyen Van",
//     lastName: "B",
//     phoneNumber: 222222222,
//     address: "cbd",
//     email: "1234@gmail.com",
//     birthday: "01/01/2000",
//   },
//   {
//     id: 3,
//     firstName: "Nguyen Van",
//     lastName: "B",
//     phoneNumber: 333333333,
//     address: "cde",
//     email: "12345@gmail.com",
//     birthday: "01/01/2000",
//   },
// ];

// post
router.post("/", function (req, res, next) {
  try {
    const dataCustomer = req.body;
    const newItem = new Customer(dataCustomer);
    newItem.save().then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  try {
    Customer.find().then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

// get id
router.get("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Customer.findById(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

// get querystring
// router.get("/search", function (req, res, next) {
//   const text = req.query.text;
//   const firstName = req.query.firstName;
//   const lastName = req.query.lastName;
//   const email = req.query.email;
//   const phoneNumber = req.query.phoneNumber;
//   const address = req.query.address;
//   const birthday = req.query.birthday;

//   console.log(text, firstName, lastName, email, phoneNumber, address, birthday);
//   res.send({ massage: "get success" });
// });

// patch (put)
router.patch("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    Customer.findByIdAndUpdate(id, data, {
      new: true,
    }).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

// delete
router.delete("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Customer.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

//----------------------------------------------------//
//questions 4: Hiển thị tất cả các khách hàng có địa chỉ ở Quận Hải Châu

// router.get("/questions/4", async (req, res, next) => {
//   try {
//     const text = "Hải Châu";
//     let query = { address: new RegExp(`${text}`) };
//     const results = await findDocuments({ query }, "customers");
//     res.json({ ok: true, results });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
//{ $regex: text, $options: "i" }

router.get("/questions/4", function (req, res) {
  const { address } = req.query;
  console.log(address);
  let query = { address: new RegExp(address, "i") }; // new RegExp: tìm một chuỗi nằm trong một chuỗi sẵn có, i: tìm kiếm không phân biệt chữ hoa, thường
  //cách 2: let query = { address: { $regex: text, $options: "i" }}
  console.log(query);
  findDocuments({ query }, "customers")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------------------------------------------------//

//----------------------------------------------------//
// questions 5: Hiển thị tất cả các khách hàng có năm sinh 1990

router.get("/questions/5", async (req, res, next) => {
  const { birthday } = req.query;
  try {
    let query = { $expr: { $eq: [{ $year: "$birthday" }, birthday.$year] } };
    const results = await findDocuments({ query }, "customers");
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json(err);
  }
});
//----------------------------------------------------//

//----------------------------------------------------//
// questions 6: Hiển thị tất cả các khách hàng có sinh nhật là hôm nay

router.get("/questions/6", async (req, res) => {
  try {
    const today = new Date();
    const eqDay = {
      $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
    };
    const eqMonth = { $eq: [{ $month: "$birthday" }, { $month: today }] };
    let query = { $expr: { $and: [eqDay, eqMonth] } };
    const results = await findDocuments({ query }, "customers");
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json(err);
  }
});
//----------------------------------------------------//

module.exports = router;
