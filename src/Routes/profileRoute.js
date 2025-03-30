const express = require("express");
const UserModel = require("../models/UserModel.js");
const profileRouter = express.Router();

profileRouter.put("/updateuser", async (req, res) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "emailId",
    "skills",
  ];
  const { emailId, gender, skills } = req.body;
  const REQUESTED_UPDATES = Object.keys(req.body);
  try {
    if (req?.body?.skills.length > 10) {
      throw new Error("Skills cannot be morethan 10");
    }
    for (let i = 0; i < REQUESTED_UPDATES.length; i++) {
      if (!ALLOWED_UPDATES.includes(REQUESTED_UPDATES[i])) {
        throw new Error("Update not allowed for some fields");
      }
    }

    const data = await UserModel.findOneAndUpdate(
      { emailId: emailId },
      { gender: gender, skills: skills },
      { returnDocument: "after", runValidators: true, context: "query" }
    );
    console.log(data);
    res.status(200).send("Document updated successfully:" + data);
  } catch (error) {
    console.log(error);
    res.status(400).send("error: " + error.message);
  }
});

profileRouter.get("/getallusers", async (req, res) => {
  try {
    const data = await UserModel.find();
    if (data.length === 0) {
      return res.status(400).send("User Not Found");
    } else {
      return res.status(200).send(data);
    }
  } catch (error) {
    console.log("error: " + error.message);
  }
});

module.exports = { profileRouter };
