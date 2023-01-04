const { default: mongoose } = require("mongoose");
var moment = require("moment");

const { Order } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");
// require
const { findDocuments } = require("../helpers/MongoDBHelpers");

var express = require("express");
var router = express.Router();

// let dataOrders = [
//   {
//     id: 1,
//     createdDate: "11/01/2022",
//     shippedDate: "14/02/2022",
//     status: "Đang giao",
//     description: "Điện thoại Iphone 14",
//     shippingAddress: "abc",
//     paymentType: "Tiền mặt",
//     sustomerId: 1,
//     employeeId: 1,
//   },
//   {
//     id: 2,
//     createdDate: "12/01/2022",
//     ShippedDate: "16/02/2022",
//     Status: "Đang ở kho",
//     Description: "Đồng hồ",
//     ShippingAddress: "bcd",
//     PaymentType: "Tiền mặt",
//     CustomerId: 2,
//     EmployeeId: 2,
//   },
//   {
//     id: 3,
//     createdDate: "13/01/2022",
//     ShippedDate: "17/02/2022",
//     Status: "Đang vận chuyển",
//     Description: "TiVi",
//     ShippingAddress: "def",
//     PaymentType: "Tiền mặt",
//     CustomerId: 3,
//     EmployeeId: 3,
//   },
// ];

// post
router.post("/", function (req, res, next) {
  try {
    const dataOrder = req.body;
    const newItem = new Order(dataOrder);
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
    Order.find()
      .populate("customer")
      .populate("employee")
      .populate("orderDetails.product")
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
    Order.findById(id)
      .populate("customer")
      .populate("employee")
      .populate("orderDetails.product")
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
//   const createdDate = req.query.createdDate;
//   const shippedDate = req.query.shippedDate;
//   const status = req.query.status;
//   const description = req.query.description;
//   const shippingAddress = req.query.shippingAddress;
//   const paymentType = req.query.paymentType;
//   const customerId = req.query.customerId;
//   const employeeId = req.query.employeeId;
//   console.log(
//     text,
//     createdDate,
//     shippedDate,
//     status,
//     description,
//     shippingAddress,
//     paymentType,
//     customerId,
//     employeeId
//   );
//   res.send({ massage: "get success" });
// });

// patch (put)
router.patch("/:id", function (req, res, next) {
  try {
    const { id } = req.params;
    const data = req.body;
    Order.findByIdAndUpdate(id, data, {
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
    Order.findByIdAndDelete(id).then((result) => {
      res.send(result);
    });
  } catch (err) {
    res.status(500);
  }
});
// lookup

// lookup Customer
const lookupCustomer = {
  $lookup: {
    from: "customers",
    localField: "customerId",
    foreignField: "_id",
    as: "customer",
  },
};
// lookup Employee
const lookupEmployee = {
  $lookup: {
    from: "employees",
    localField: "employeeId",
    foreignField: "_id",
    as: "employee",
  },
};
//----------------------------------------------------------//
// questions 7: Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED
router.get("/questions/7", function (req, res, next) {
  try {
    const { status } = req.query;
    Order.find(
      { status: status },
      "createdDate status paymentType orderDetails customerId employeeId"
    )
      .populate({
        path: "orderDetails.product",
        select: "name price discount stock",
      })
      .populate({ path: "customer", select: "firstName lastName phoneNumber" })
      .populate({ path: "employee", select: "firstName lastName phoneNumber" })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
//----------------------------------------------------------//

//----------------------------------------------------------//
// questions 8:Hiển thị tất cả các đơn hàng có trạng thái là COMPLETED trong ngày hôm nay
router.get("/questions/8", function (req, res) {
  try {
    let { status, fromDate, toDate } = req.query;
    fromDate = new Date(fromDate);
    const tmpDate = new Date(toDate);
    toDate = new Date(tmpDate.setDate(tmpDate.getDate() + 1));

    const compareStatus = { $eq: ["$status", status] };
    const compareFromDate = { $gte: ["$createdDate", fromDate] };
    const compareToDate = { $lt: ["$createdDate", toDate] };

    Order.aggregate([
      {
        $match: {
          $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
        },
      },
    ])
      .project(
        "_id status paymentType createdeDate orderDetails employee customer"
      )
      .then((result) => {
        //populate
        Order.populate(result, [
          { path: "employee" },
          { path: "customer" },
          { path: "orderDetails.product", select: "name price discount" },
        ])
          .then((date) => {
            res.send(date);
          })
          .catch((err) => {
            res.status(400).send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(500);
  }
});
//----------------------------------------------------------//
//----------------------------------------------------------//
//questions 9: Hiển thị tất cả các đơn hàng có trạng thái là CANCELED
router.get("/questions/9", function (req, res) {
  const text = "canceled";
  let query = { status: new RegExp(text, "i") };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//----------------------------------------------------------//

//----------------------------------------------------------//
// questions 10: Hiển thị tất cả các đơn hàng có trạng thái là CANCELED trong ngày hôm nay
router.get("/questions/10", function (req, res) {
  const text = "canceled";
  const toDay = moment();
  let query = {
    $and: [
      { status: new RegExp(text, "i") },
      { createdDate: new Date(toDay.format("YYYY-MM-DD")) },
    ],
  };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
//----------------------------------------------------------//

//----------------------------------------------------------//
//questions 11: Hiển thị tất cả các đơn hàng có hình thức thanh toán là CASH
router.post("/questions/11", function (req, res) {
  const { paymentType } = req.body;
  let query = { paymentType: paymentType };
  try {
    Order.find(query)
      .populate("orderDetails.product")
      .populate("customer")
      .populate("employee")
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
//----------------------------------------------------------//

//----------------------------------------------------------//
// questions 12: Hiển thị tất cả các đơn hàng có hình thức thanh toán là CREADIT CARD
router.get("/questions/12", function (req, res) {
  const text = "careadit card";
  let query = { paymentType: new RegExp(text, "i") };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------------------------------------------------------//

//----------------------------------------------------------//
// questions 13: Hiển thị tất cả các đơn hàng có địa chỉ giao hàng là Hà Nội
router.get("/questions/13", function (req, res) {
  const text = "Hà Nội";
  let query = { shippingAddress: new RegExp(text, "i") };
  findDocuments({ query }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------------------------------------------------------//

//----------------------------------------------------------//
// questions 16: Hiển thị tất cả các đơn hàng cùng với thông tin chi tiết khách hàng (Customer)
router.get("/questions/16", function (req, res) {
  const aggregate = [
    lookupCustomer,
    lookupEmployee,
    {
      $addFields: {
        customer: { $first: "$customer" },
        employee: { $first: "$employee" },
      },
    },
  ];
  findDocuments({ aggregate }, "orders")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});
//----------------------------------------------------------//
// questions 20: Hiển thị tất cả các mặt hàng được bán trong khoảng từ ngày, đến ngày

//----------------------------------------------------------//
router.get("/questions/25", function (req, res, next) {
  try {
    const aggregate = [
      { $unwind: { path: "$orderDetails", preserveNullAndEmptyArrays: true } },
      { $addFields: { productId: "$orderDetails.productId" } },
      { $project: { productId: 1 } },
      {
        $group: {
          _id: null,
          productIds: { $addToSet: "$productId" }, // tạo mảng đã mua
        },
      },
      {
        $lookup: {
          from: "products",
          let: { productIds: "$productIds" },
          pipeline: [
            { $match: { $expr: { $not: { $in: ["$_id", "$$productIds"] } } } },
          ],
          as: "ProductNotInOrderDetails",
        },
      },
    ];
    Order.aggregate(aggregate)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});
//----------------------------------------------------------//

module.exports = router;
