const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: (props) => `${props.value} is not supported`,
      },
    },
  },
  { timeStamps: true }
);

//creating a compound index
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//To check if fromUserid and toUserId are same before saving the document
connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;

  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Request to your self is not possible");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
