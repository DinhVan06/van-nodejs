const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const supplierSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        const emailRegex =
          /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,4}|\d+)$/i;
        return emailRegex.test(value);
      },
      message: `{VALUE} is not a valid email!`,
      // message: (props) => `{props.value} is not a valid email!`,
    },
    required: [true, "email is required"],
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneNumberRegex =
          /^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$/;
        return phoneNumberRegex.test(value);
      },
      message: `{phoneNumber} is not a valid phone Number`,
    },
  },
  address: { type: String, required: true },
});

const Supplier = model("Supplier", supplierSchema);
module.exports = Supplier;
