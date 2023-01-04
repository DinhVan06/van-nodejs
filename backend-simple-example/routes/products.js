const { default: mongoose } = require("mongoose");

const { Product } = require("../models");

// require
const { findDocuments } = require("../helpers/MongoDBHelpers");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

var express = require("express");
var router = express.Router();

// collection name
const COLLECTION_NAME = "products";

// lookup

// lookup Category
const lookupCategory = {
  $lookup: {
    from: "categories",
    localField: "categoryId",
    foreignField: "_id",
    as: "category",
  },
};

// lookup Category
const lookupSupplier = {
  $lookup: {
    from: "suppliers",
    localField: "supplierId",
    foreignField: "_id",
    as: "supplier",
  },
};

// let dataProducts = [
//   {
//     id: 1,
//     name: "Iphone 14",
//     price: 40000000,
//     discount: 1000000,
//     stock: 20,
//     categoryId: 1,
//     supplierId: 1,
//     description: "Điện thoại thông minh",
//   },
//   {
//     id: 2,
//     name: "Iphone 11",
//     price: 12500000,
//     discount: 500000,
//     stock: 20,
//     categoryId: 2,
//     supplierId: 2,
//     description: "Điện thoại thông minh",
//   },
//   {
//     id: 3,
//     name: "Smart watch",
//     price: 10000000,
//     discount: 300000,
//     stock: 20,
//     categoryId: 3,
//     supplierId: 3,
//     description: "Đồng hồ thông minh",
//   },
// ];

// post
router.post("/", function (req, res, next) {
  try {
    const dataProduct = req.body;
    const newItem = new Product(dataProduct);
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
    Product.find()
      .populate("category")
      .populate("supplier")
      .then((result) => {
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
    Product.findById(id)
      .populate("category")
      .populate("supplier")
      .then((result) => {
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
//   const price = req.query.price;
//   const discount = req.query.discount;
//   const stock = req.query.stock;
//   const categoryId = req.query.category;
//   const supplierId = req.query.supp;
//   const description = req.query.description;
//   console.log(
//     text,
//     name,
//     price,
//     discount,
//     stock,
//     categoryId,
//     supplierId,
//     description
//   );
//   res.send({ massage: "get success" });
// });

// patch (put)
router.patch("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    Product.findByIdAndUpdate(id, data, {
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
    Product.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});

// query

//--------------------------------------------------------//
// questions 1: Hiển thị tất cả các mặt hàng có giảm giá <= 10%
router.get("/questions/1", function (req, res, next) {
  const { discount } = req.query;
  console.log(discount);
  let query = { discount: { $lte: discount } };
  console.log(query);
  try {
    Product.find(query)
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//--------------------------------------------------------//

//--------------------------------------------------------//
// questions 2: Hiển thị tất cả các mặt hàng có tồn kho <= 5

router.get("/questions/2", function (req, res, next) {
  const { stock } = req.query;
  console.log(typeof stock);
  let query = { stock: { $lte: stock } };
  console.log(query);
  try {
    Product.find(query)
      .populate("category")
      .populate("supplier")
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//--------------------------------------------------------//

//--------------------------------------------------------//
// questions 3:Hiển thị tất cả các mặt hàng có Giá bán sau khi đã giảm giá <= 100.000

router.get("/questions/3", async (req, res, next) => {
  try {
    const { total } = req.query;
    console.log(typeof total);
    let subtract = { $subtract: [100, "$discount"] }; // trừ
    let multiply = { $multiply: ["$price", subtract] }; // nhân
    let divide = { $divide: [multiply, 100] }; // chia
    let aggregate = [
      { $match: { $expr: { $lte: [divide, parseInt(total)] } } },
    ];
    console.log(aggregate);  
    Product.aggregate(aggregate)
      .project("name price discount stock total categoryId supplierId")
      .then((result) => {
        Product.populate(result, [
          { path: "category", select: "name" },
          { path: "supplier", select: "name" },
        ])
          .then((result) => {
            res.send(result);
          })
          .catch((error) => {
            res.status(400).send({ message: error.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.sendStatus(500);
  }
});

//--------------------------------------------------------//

//--------------------------------------------------------//
//questions 17: Hiển thị tất cả các mặt hàng cùng với thông tin chi tiết của Category và Supplier
router.get("/questions/17", function (req, res) {
  const aggregate = [
    lookupCategory,
    lookupSupplier,
    {
      $addFields: {
        category: { $first: "$category" },
        supplier: { $first: "$supplier" },
      },
    },
  ];
  findDocuments({ aggregate }, "products")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//--------------------------------------------------------//
module.exports = router;
