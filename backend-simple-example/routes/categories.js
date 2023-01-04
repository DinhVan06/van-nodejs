const { default: mongoose } = require("mongoose");

const { Category } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");
var express = require("express");
var router = express.Router();

// let data = [
//   { id: 1, name: "samsung" },
//   { id: 2, name: "điện máy" },
//   { id: 3, name: "máy tính" },
// ];

//post
router.post("/", function (req, res, next) {
  // const newCategory = req.body;
  // console.log(newCategory);
  // data.push(newCategory);
  // res.status(201).send({ message: "inserted" });
  try {
    const data = req.body;
    const newItem = new Category(data);
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
    Category.find().then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

/* GET ID users listing. */
router.get("/:id", function (req, res, next) {
  // if (req.params.id === "search") {
  //   next();
  //   return;
  // }
  // const id = parseInt(req.params.id);
  // const found = data.find((x) => {
  //   return x.id === id;
  // });
  // console.log("id: ", id);
  // if (found) {
  //   res.send(found);
  //   return;
  // }
  // res.status(404).send({ message: "category not found" });

  try {
    const { id } = req.params;
    Category.findById(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

/* GET users listing. */
// querystring
// router.get("/search", function (req, res, next) {
//   const text = req.query.text;
//   const price = req.query.price;
//   console.log(text);
//   console.log(price);
//   res.send({ message: "Get success " });
// });

// patch
router.patch("/:id", function (req, res, next) {
  // const id = req.params.id;
  try {
    const { id } = req.params;
    const data = req.body;
    Category.findByIdAndUpdate(id, data, {
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
    Category.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
