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
  const userId = req.id;
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
      { _id: userId },
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

profileRouter.get("/getuserdetails", async (req, res) => {
  const userId = req.id;

  try {
    const userDetails = await UserModel.findOne({ _id: userId });
    if (!userDetails) {
      throw new Error("User not found");
    } else {
      res.status(200).send(userDetails);
    }
  } catch (error) {
    res.status(500).send("Error : " + error.message);
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

profileRouter.patch("/editdetails", async (req, res) => {
  const ALLOWED_EDITS = [
    "firstName",
    "lastName",
    "gender",
    "age",
    "photoUrl",
    "skills",
    "about",
  ];

  try {
    const isUpdateAllowed = Object.keys(req.body).every((eachkey) => {
      return ALLOWED_EDITS.includes(eachkey);
    });
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    } else {
      const loggedInUser = await UserModel.findOne({ _id: req.id });

      Object.keys(req.body).forEach((eachKey) => {
        loggedInUser[eachKey] = req.body[eachKey];
      });
      await loggedInUser.save();
      res.status(200).json({
        message: `${loggedInUser.firstName}, your updates are updated successfully `,
        data: loggedInUser,
      });
    }
  } catch (error) {
    res.status(404).send("Error : " + error.message);
  }
});

module.exports = { profileRouter };
