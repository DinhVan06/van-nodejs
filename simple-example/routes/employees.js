var express = require("express");
var router = express.Router();

let dataEmployees = [
  {
    id: 1,
    firstName: "Tran Van",
    lastName: "A",
    phoneNumber: 30300303030,
    address: "abcd",
    email: "abc@gmail.com",
    birthday: "01/01/1995",
  },
  {
    id: 2,
    firstName: "Tran Van",
    lastName: "B",
    phoneNumber: 12345677890,
    address: "cbde",
    email: "bcd@gmail.com",
    birthday: "01/06/1999",
  },
  {
    id: 3,
    firstName: "Tran Van",
    lastName: "B",
    phoneNumber: 223434535340,
    address: "cdef",
    email: "def@gmail.com",
    birthday: "06/11/1998",
  },
];

// post
router.post("/", function (req, res, next) {
  const newEmployees = req.body;
  console.log(newEmployees);
  dataEmployees.push(newEmployees);
  res.status(201).send({ message: "inserted" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(dataEmployees);
});

// get id
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  const id = req.params.id;
  const found = dataEmployees.find((x) => {
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
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;
  const email = req.query.email;
  const phoneNumber = req.query.phoneNumber;
  const address = req.query.address;
  const birthday = req.query.birthday;

  console.log(text, firstName, lastName, email, phoneNumber, address, birthday);
  res.send({ massage: "get success" });
});

// patch (put)
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber, address, birthday } =
    req.body;
  let found = dataEmployees.find((x) => {
    return x.id === parseInt(id);
  });
  found.firstName = firstName;
  found.lastName = lastName;
  found.email = email;
  found.phoneNumber = phoneNumber;
  found.address = address;
  found.birthday = birthday;

  res.send({ message: "Updated" });
});

// delete
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  dataEmployees = dataEmployees.filter((x) => x.id !== parseInt(id));
  res.send({ message: "Deleted" });
});
module.exports = router;
