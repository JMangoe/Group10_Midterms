//[BOOK-02] Add validator for adding/updating book input (title required, availableCopies >= 0).

module.exports.validateBook = (book) => {
    const errors = {};

    if (!book.title || book.title.trim() === "") {
        errors.title = "Title is required";
    }
    
    if (!book.author || book.author.trim() === "") {
        errors.author = "Author is required";
    }
    
    if (book.availableCopies === undefined || book.availableCopies === null) {
        errors.availableCopies = "Available copies is required";
    } 
    else if (typeof book.availableCopies !== "number" || isNaN(book.availableCopies)) {
        errors.availableCopies = "Available copies must be a valid number";
    } 
    else if (book.availableCopies < 0) {
        errors.availableCopies = "Available copies must be greater than or equal to 0";
    }
    
    return errors;
};
