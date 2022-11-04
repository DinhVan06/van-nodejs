const { default: mongoose } = require("mongoose");

const { Category } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const id = "63629c61f8726d031b3e3614";
  const data = { name: "New Name" };
  Category.findByIdAndUpdate(id, data, {
    new: true,
  }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
