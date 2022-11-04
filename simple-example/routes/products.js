var express = require("express");
var router = express.Router();

let dataProducts = [
  {
    id: 1,
    name: "Iphone 14",
    price: 40000000,
    discount: 1000000,
    stock: 20,
    categoryId: 1,
    supplierId: 1,
    description: "Điện thoại thông minh",
  },
  {
    id: 2,
    name: "Iphone 11",
    price: 12500000,
    discount: 500000,
    stock: 20,
    categoryId: 2,
    supplierId: 2,
    description: "Điện thoại thông minh",
  },
  {
    id: 3,
    name: "Smart watch",
    price: 10000000,
    discount: 300000,
    stock: 20,
    categoryId: 3,
    supplierId: 3,
    description: "Đồng hồ thông minh",
  },
];

// post
router.post("/", function (req, res, next) {
  const newProducts = req.body;
  console.log(newProducts);
  dataProducts.push(newProducts);
  res.status(201).send({ message: "inserted" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(dataProducts);
});

// get id
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  const id = req.params.id;
  const found = dataProducts.find((x) => {
    return x.id === parseInt(id);
  });
  if (found) {
    res.send(found);
    return;
  }
  res.status(404).send({ message: "Customers Not Found" });
});

// get querystring
router.get("/search", function (req, res, next) {
  const text = req.query.text;
  const name = req.query.name;
  const price = req.query.price;
  const discount = req.query.discount;
  const stock = req.query.stock;
  const categoryId = req.query.category;
  const supplierId = req.query.supp;
  const description = req.query.description;
  console.log(
    text,
    name,
    price,
    discount,
    stock,
    categoryId,
    supplierId,
    description
  );
  res.send({ massage: "get success" });
});

// patch (put)
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const { name, price, discount, stock, categoryId, supplierId, description } =
    req.body;
  let found = dataProducts.find((x) => {
    return x.id === parseInt(id);
  });
  found.name = name;
  found.price = price;
  found.discount = discount;
  found.stock = stock;
  found.categoryId = categoryId;
  found.supplierId = supplierId;
  found.description = description;

  res.send({ message: "Updated" });
});

// delete
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  dataProducts = dataProducts.filter((x) => x.id !== parseInt(id));
  res.send({ message: "Deleted" });
});
module.exports = router;
