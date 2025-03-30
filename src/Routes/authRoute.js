const express = require("express");
const UserModel = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { signUpValidator } = require("../utils/signUpValidator.js");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //validate the req.body
    signUpValidator(req);

    const { firstName, lastName, emailId, password } = req.body;
    //hashing password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).send("User SignedUp Successfully, new user:" + newUser);
  } catch (error) {
    res.status(400).send("Something went wrong:" + error.message);
  }
});

authRouter.post("/signIn", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //find if user(emailId exists)
    const data = await UserModel.findOne({ emailId: emailId });
    if (!data) {
      throw new Error("Invalid Credentials ");
    }
    // Check if password is correct.

    const validpassword = await bcrypt.compare(password, data.password);

    if (!validpassword) {
      throw new Error("Ivalid Credentials");
    } else {
      // create a jwt token

      const token = jwt.sign({ _id: data._id }, "mysecretkey", {
        expiresIn: "1h",
      });

      //send the token with cookies

      res.cookie("token", token);

      //sending response after successfull signin
      res.status(200).send("User signedIn successfully");
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
    console.log("Error : " + error.message);
  }
});

module.exports = { authRouter };
