const { default: mongoose } = require("mongoose");

const { Supplier } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

var express = require("express");
var router = express.Router();

const { findDocuments } = require("../helpers/MongoDBHelpers");
// let dataSuppliers = [
//   {
//     id: 1,
//     name: "Nguyen Van A",
//     email: "123@gmail.com",
//     phoneNumber: 1111111111,
//     address: "abc",
//   },
//   {
//     id: 2,
//     name: "Nguyen Van B",
//     email: "1234@gmail.com",
//     phoneNumber: 2222222222,
//     address: "bcd",
//   },
//   {
//     id: 3,
//     name: "Nguyen Van C",
//     email: "1235@gmail.com",
//     phoneNumber: 3333333333,
//     address: "cde",
//   },
// ];

// post
router.post("/", function (req, res, next) {
  try {
    const dataSupplier = req.body;
    const newItem = new Supplier(dataSupplier);
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
    Supplier.find().then((result) => {
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
    Supplier.findById(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

// get querystring
// router.get("/search", function (req, res, next) {
//   const text = req.query.text;
//   const name = req.query.name;
//   const email = req.query.email;
//   const phoneNumber = req.query.phoneNumber;
//   const address = req.query.address;
//   console.log(text, name, email, phoneNumber, address);
//   res.send({ massage: "get success" });
// });

// patch (put)
router.patch("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    Supplier.findByIdAndUpdate(id, data, {
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
    Supplier.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});
//---------------------------------------------------------------//
//questions 15:Hiển thị tất cả các nhà cung cấp có tên là: (SONY, SAMSUNG, TOSHIBA, APPLE)
router.get("/questions/15", function (req, res) {
  try {
    const { name } = req.query;
    let query = { name: { $in: name.split(",") } };
    Supplier.find(query)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(500).sen(err);
  }
});
//---------------------------------------------------------------//
module.exports = router;
