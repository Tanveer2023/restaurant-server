// Importing modules
const express = require("express");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const Wishlist = require("./models/wishlistModel");

const app = express();

app.use(express.json());

// Handling post request
app.post("/login", async (req, res, next) => {
  let { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  if (!existingUser || existingUser.password != password) {
    const error = Error("Wrong details please check at once");
    return next(error);
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "f00diesecretkey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  res.status(200).json({
    success: true,
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
  });
});

// Handling post request
app.post("/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const newUser = User({
    name,
    email,
    password,
  });

  try {
    await newUser.save();
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      "f00diesecretkey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(201).json({
    success: true,
    data: { userId: newUser.id, email: newUser.email, token: token },
  });
});

// handle post request to add a restaurant to wishlist
app.post("/wishlist", async (req, res, next) => {
  const { email, restaurant_id, restaurant_name, restaurant_image } = req.body;
  const newWishlist = Wishlist({
    email,
    restaurant_id,
    restaurant_name,
    restaurant_image,
  });

  try {
    await newWishlist.save();
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(201).json({
    success: true,
    data: newWishlist,
  });
});

// handle get request to get all restaurants in wishlist
app.get("/wishlist", async (req, res, next) => {
  const { email } = req.body;
  let wishlist;

  try {
    wishlist = await Wishlist.find({ email: email });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

// handle get item based on restaurant id and email
app.get("/wishlist/:restaurant_id/:email", async (req, res, next) => {
  const { restaurant_id, email } = req.params;
  let wishlist;

  try {
    wishlist = await Wishlist.findOne({
      email: email,
      restaurant_id: restaurant_id,
    });
  } catch {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

// handle delete request to delete a restaurant from wishlist
app.delete("/wishlist/:restaurant_id/:email", async (req, res, next) => {

    const { restaurant_id, email } = req.params;
    let wishlist;

    console.log(restaurant_id, email)
    try {
        wishlist = await Wishlist.findOne({
            email: email,
            restaurant_id: restaurant_id,
        });

        if (!wishlist) {
            const error = new Error("Error! Restaurant not found.");
            return next(error);
        }

        await wishlist.deleteOne();

    } catch (err) {
        console.log(err);
        const error = new Error("Error! Something went wrong.");
        return next(error);
    }

    res.status(200).json({
        success: true,
        data: wishlist,
    });

});


//Connecting to the database
const dbURI =
  "mongodb+srv://admin:admin123@cluster0.5112iyv.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen("8080", () => {
      console.log("Server is listening on port 8080");
    });
  })
  .catch((err) => {
    console.error("Error occurred while connecting to MongoDB:", err);
  });
