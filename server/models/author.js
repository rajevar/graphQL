const mongoose = require("mongoose");
const mSchema = mongoose.Schema;

const authorSchema = new mSchema({
  name: String,
  age: Number
});

module.exports = mongoose.model("Author", authorSchema);
