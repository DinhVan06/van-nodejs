var express = require("express");
var router = express.Router();

let dataCustomers = [
  {
    id: 1,
    firstName: "Nguyen Van",
    lastName: "A",
    phoneNumber: 1111111111,
    address: "abc",
    email: "123@gmail.com",
    birthday: "01/01/2000",
  },
  {
    id: 2,
    firstName: "Nguyen Van",
    lastName: "B",
    phoneNumber: 222222222,
    address: "cbd",
    email: "1234@gmail.com",
    birthday: "01/01/2000",
  },
  {
    id: 3,
    firstName: "Nguyen Van",
    lastName: "B",
    phoneNumber: 333333333,
    address: "cde",
    email: "12345@gmail.com",
    birthday: "01/01/2000",
  },
];

// post
router.post("/", function (req, res, next) {
  const newCustomers = req.body;
  console.log(newCustomers);
  dataCustomers.push(newCustomers);
  res.status(201).send({ message: "inserted" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(dataCustomers);
});

// get id
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  const id = req.params.id;
  const found = dataCustomers.find((x) => {
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
  let found = dataCustomers.find((x) => {
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
  dataCustomers = dataCustomers.filter((x) => x.id !== parseInt(id));
  res.send({ message: "Deleted" });
});
module.exports = router;
