const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

async function jwtAuthMiddleware(req, res, next) {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Token is not valid/found");
    }
    //lets verify our token is valid or not

    const decodedMessage = jwt.verify(token, "mysecretkey");

    //check if the userId exists in the db

    const isValidUser = await UserModel.findOne({ _id: decodedMessage._id });

    if (!isValidUser) {
      return res.status(404).send("Token malformed");
    } else {
      console.log(isValidUser);
      req.id = isValidUser._id;
      next();
    }
  } catch (error) {
    res.status(404).send("Error : " + error.message);
  }
}

module.exports = { jwtAuthMiddleware };
