const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

// order detail
const orderDetailSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 0 },
});

orderDetailSchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

orderDetailSchema.set("toObject", { virtuals: true });

// Virtuals in JSON()
orderDetailSchema.set("toJSON", { virtuals: true });

//--------------------------------------------------//
// order
const orderSchema = new Schema({
  createdDate: {
    type: Date,
    required: true,
    default: Date.now(),
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
        if (["WAITING", "COMPLETED", "CANCELED"].includes(value)) {
          return true;
        } else {
          return false;
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
          ["CREDIT CARD", "CASH", "MOMO", "ZALOPAY"].includes(
            value.toUpperCase()
          )
        ) {
          return true;
        }
        return false;
      },
      message: `Payment type: {VALUE} is invalid!`,
    },
  },
  customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  employeeId: {
    type: Schema.Types.ObjectId,
    ref: "Employees",
    required: true,
  },
  orderDetails: [orderDetailSchema],
});

// Virtual with Populate
orderSchema.virtual("customer", {
  ref: "Customer",
  localField: "customerId",
  foreignField: "_id",
  justOne: true,
});
orderSchema.virtual("employee", {
  ref: "Employees",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in Object();
orderSchema.set("toObject", { virtuals: true });

// Virtuals in JSON()
orderSchema.set("toJSON", { virtuals: true });

orderSchema.plugin(mongooseLeanVirtuals);
const Order = model("Order", orderSchema);
module.exports = Order;
