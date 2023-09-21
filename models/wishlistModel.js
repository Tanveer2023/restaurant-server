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
  restaurant_name: {
    type: String,
    required: true,
  },
  restaurant_image: {
    type: String,
    required: true,
  },
  restaurant_phone: {
    type: String,
    required: true,
  },
  restaurant_rating: {
    type: String,
    required: true,
  },
  restaurant_review_count: {
    type: String,
    required: true,
  },
  restaurant_city: {
    type: String,
    required: true,
  },
  restaurant_location1: {
    type: String,
    required: true,
  },

  restaurant_latitude: {
    type: String,
    required: true,
  },
  restaurant_longitude: {
    type: String,
    required: true,
  },

});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

module.exports = Wishlist;