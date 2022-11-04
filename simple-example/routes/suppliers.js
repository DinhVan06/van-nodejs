var express = require("express");
var router = express.Router();

let dataSuppliers = [
  {
    id: 1,
    name: "Nguyen Van A",
    email: "123@gmail.com",
    phoneNumber: 1111111111,
    address: "abc",
  },
  {
    id: 2,
    name: "Nguyen Van B",
    email: "1234@gmail.com",
    phoneNumber: 2222222222,
    address: "bcd",
  },
  {
    id: 3,
    name: "Nguyen Van C",
    email: "1235@gmail.com",
    phoneNumber: 3333333333,
    address: "cde",
  },
];

// post
router.post("/", function (req, res, next) {
  const newSuooliers = req.body;
  console.log(newSuooliers);
  dataSuppliers.push(newSuooliers);
  res.status(201).send({ message: "inserted" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(dataSuppliers);
});

// get id
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  const id = req.params.id;
  const found = dataSuppliers.find((x) => {
    return x.id === parseInt(id);
  });
  if (found) {
    res.send(found);
    return;
  }
  res.status(404).send({ message: "Suppliers Not Found" });
});

// get querystring
router.get("/search", function (req, res, next) {
  const text = req.query.text;
  const name = req.query.name;
  const email = req.query.email;
  const phoneNumber = req.query.phoneNumber;
  const address = req.query.address;
  console.log(text, name, email, phoneNumber, address);
  res.send({ massage: "get success" });
});

// patch (put)
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const { name, email, phoneNumber, address } = req.body;
  let found = dataSuppliers.find((x) => {
    return x.id === parseInt(id);
  });
  found.name = name;
  found.email = email;
  found.phoneNumber = phoneNumber;
  found.address = address;

  res.send({ message: "Updated" });
});

// delete
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  dataSuppliers = dataSuppliers.filter((x) => x.id !== parseInt(id));
  res.send({ message: "Deleted" });
});
module.exports = router;
