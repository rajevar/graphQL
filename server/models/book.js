const mongoose = require("mongoose");
const mSchema = mongoose.Schema;

const bookSchema = new mSchema({
  name: String,
  genre: String,
  authorId: String
});

module.exports = mongoose.model("Book", bookSchema);
