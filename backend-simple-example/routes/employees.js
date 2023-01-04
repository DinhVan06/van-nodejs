const { default: mongoose } = require("mongoose");
var passport = require("passport");
const { Employees } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");
const { findDocuments } = require("../helpers/MongoDBHelpers");

var express = require("express");
var router = express.Router();

// let dataEmployees = [
//   {
//     id: 1,
//     firstName: "Tran Van",
//     lastName: "A",
//     phoneNumber: 30300303030,
//     address: "abcd",
//     email: "abc@gmail.com",
//     birthday: "01/01/1995",
//   },
//   {
//     id: 2,
//     firstName: "Tran Van",
//     lastName: "B",
//     phoneNumber: 12345677890,
//     address: "cbde",
//     email: "bcd@gmail.com",
//     birthday: "01/06/1999",
//   },
//   {
//     id: 3,
//     firstName: "Tran Van",
//     lastName: "B",
//     phoneNumber: 223434535340,
//     address: "cdef",
//     email: "def@gmail.com",
//     birthday: "06/11/1998",
//   },
// ];

// post
router.post("/", function (req, res, next) {
  try {
    const dataEmployees = req.body;
    const newItem = new Employees(dataEmployees);
    newItem.save().then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

/* GET users listing. */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    try {
      Employees.find().then((result) => {
        res.send(result);
      });
    } catch (err) {
      res.status(500);
    }
  }
);

// get id
router.get("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    Employees.findById(id).then((result) => {
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
    Employees.findByIdAndUpdate(id, data, {
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
    Employees.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

//---------------------------------------------------------------//
// questions 14: Hiển thị tất cả các nhân viên có sinh nhật là hôm nay
router.get("/questions/14", function (req, res) {
  const toDay = new Date();
  const eqDay = { $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: toDay }] };
  const eqMonth = { $eq: [{ $month: "$birthday" }, { $month: toDay }] };
  let query = { $expr: { $and: [eqDay, eqMonth] } };
  findDocuments({ query }, "employees")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//---------------------------------------------------------------//

module.exports = router;
