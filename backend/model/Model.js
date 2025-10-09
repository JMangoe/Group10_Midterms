//[BOOK-01] Create Book model with fields: id, title, author, availableCopies.//

const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    availableCopies: { type: Number, required: true, min: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model("Book", bookSchema);