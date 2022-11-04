const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const orderSchema = new Schema({
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },

  shippedDate: {
    type: Date,
    validate: {
      validator: function (value) {
        if (!value) return true;

        if (value < this.createdDate) {
          return false;
        }
        return true;
      },
      message: `Shipped date: {VALUE} is invalid!`,
    },
  },
  status: {
    type: String,
    required: true,
    default: "WAITING",
    validate: {
      validator: (value) => {
        if (
          value !== "WAITING" &&
          value !== "COMPLETED" &&
          value !== "CANCELED"
        ) {
          return false;
        } else {
          return true;
        }
      },
      message: `status: {status} is invalid`,
    },
  },
  description: { type: String },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
    default: "CASH",
    validate: {
      validator: (value) => {
        if (
          value !== "CREDIT CARD" &&
          value !== "CASH" &&
          value !== "MOMO" &&
          value !== "ZALOPAY"
        ) {
          return false;
        }
        return true;
      },
      message: `Payment type: {VALUE} is invalid!`,
    },
  },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "Employees", required: true },
});

const Order = model("Order", orderSchema);
module.exports = Order;
