const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const productSchema = new Schema({
  name: { type: String, required: true },
  price: {
    type: Number,
    required: true,
    min: [0, "Must be at least 0, got {VALUE}"],
  },
  discount: { type: Number, min: 0, max: 100, required: true },
  stock: { type: Number, min: 0, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
  description: { type: String, required: true },
});

// virtual
productSchema.virtual("total").get(function () {
  return (this.price * (100 - this.discount)) / 100;
});

// Virtual with Populate
productSchema.virtual("category", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true,
});
// Virtuals in Object()
productSchema.set("toObject", { virtuals: true });

// Virtuals in JSON()
productSchema.set("toJSON", { virtuals: true });

productSchema.plugin(mongooseLeanVirtuals);

const Product = model("Product", productSchema);

module.exports = Product;
