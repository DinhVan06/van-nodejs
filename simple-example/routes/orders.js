var express = require("express");
var router = express.Router();

let dataOrders = [
  {
    id: 1,
    createdDate: "11/01/2022",
    shippedDate: "14/02/2022",
    status: "Đang giao",
    description: "Điện thoại Iphone 14",
    shippingAddress: "abc",
    paymentType: "Tiền mặt",
    sustomerId: 1,
    employeeId: 1,
  },
  {
    id: 2,
    createdDate: "12/01/2022",
    ShippedDate: "16/02/2022",
    Status: "Đang ở kho",
    Description: "Đồng hồ",
    ShippingAddress: "bcd",
    PaymentType: "Tiền mặt",
    CustomerId: 2,
    EmployeeId: 2,
  },
  {
    id: 3,
    createdDate: "13/01/2022",
    ShippedDate: "17/02/2022",
    Status: "Đang vận chuyển",
    Description: "TiVi",
    ShippingAddress: "def",
    PaymentType: "Tiền mặt",
    CustomerId: 3,
    EmployeeId: 3,
  },
];

// post
router.post("/", function (req, res, next) {
  const newOrders = req.body;
  console.log(newOrders);
  dataOrders.push(newOrders);
  res.status(201).send({ message: "inserted" });
});

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send(dataOrders);
});

// get id
router.get("/:id", function (req, res, next) {
  if (req.params.id === "search") {
    next();
    return;
  }
  const id = req.params.id;
  const found = dataOrders.find((x) => {
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
  const createdDate = req.query.createdDate;
  const shippedDate = req.query.shippedDate;
  const status = req.query.status;
  const description = req.query.description;
  const shippingAddress = req.query.shippingAddress;
  const paymentType = req.query.paymentType;
  const customerId = req.query.customerId;
  const employeeId = req.query.employeeId;
  console.log(
    text,
    createdDate,
    shippedDate,
    status,
    description,
    shippingAddress,
    paymentType,
    customerId,
    employeeId
  );
  res.send({ massage: "get success" });
});

// patch (put)
router.patch("/:id", function (req, res, next) {
  const { id } = req.params;
  const {
    createdDate,
    shippedDate,
    status,
    sdescriptiontock,
    shippingAddress,
    paymentType,
    customerId,
    employeeId,
  } = req.body;
  let found = dataOrders.find((x) => {
    return x.id === parseInt(id);
  });
  found.createdDate = createdDate;
  found.shippedDate = shippedDate;
  found.status = status;
  found.sdescriptiontock = sdescriptiontock;
  found.shippingAddress = shippingAddress;
  found.paymentType = paymentType;
  found.customerId = customerId;
  found.employeeId = employeeId;

  res.send({ message: "Updated" });
});

// delete
router.delete("/:id", function (req, res, next) {
  const { id } = req.params;
  dataOrders = dataOrders.filter((x) => x.id !== parseInt(id));
  res.send({ message: "Deleted" });
});
module.exports = router;
