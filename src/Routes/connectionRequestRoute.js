const express = require("express");
const ConnectionRequestModel = require("../models/ConnectionsModel");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post("/send/:status/:toUserId", async (req, res) => {
  try {
    const fromUserId = req.id;
    const { status, toUserId } = req.params;
    //check if we are recieving valid sendrequest status
    const ALLOWED_STATUS = ["ignore", "interested"];
    if (!ALLOWED_STATUS.includes(status)) {
      throw new Error(`${status} connection request is  not allowed`);
    }

    //check if there is an already existing request
    const existingConnectionRequest = ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });
    //if already exists throw error-connection already exists
    if (existingConnectionRequest) {
      throw new Error("Connection already exists");
    }

    //check if

    const newConnectionRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newConnectionRequest.save();
    res.status(200).json({
      message: `${status} connection request to user`,
      request: data,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = connectionRequestRouter;
