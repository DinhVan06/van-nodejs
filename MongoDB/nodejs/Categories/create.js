const { default: mongoose } = require("mongoose");

const { Category } = require("../models");
// MONGOOSE
mongoose.connect("mongodb://localhost:27017/Test");

try {
  const data = {
    name: "Tên danh mục 1",
    description: "Mô tả 1...",
  };

  const newItem = new Category(data);
  newItem.save().then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}
