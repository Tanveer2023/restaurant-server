const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  restaurant_id: {
    type: String,
    required: true,
  },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;
