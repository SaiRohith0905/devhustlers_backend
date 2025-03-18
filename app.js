const express = require("express");
const {
  connectToMongoDBUsingMongoose,
} = require("./src/config/mongoose.config.js");
const app = express();

const UserModel = require("./src/models/UserModel.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.post("/user/signUp", async (req, res) => {
  //creating a new instance of usermodel
  const { firstName, lastName, emailId, password, age, gender } = req.body;

  const newUser = UserModel({
    firstName: firstName,
    lastName: lastName,
    emailId: emailId,
    password: password,
    age: age,
    gender: gender,
  });

  try {
    await newUser.save();
    res.status(200).send("User SignedUp Successfully, new user:" + newUser);
  } catch (error) {
    res.status(400).send("Something went wrong:" + error.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Application error !! Something went wrong");
  }
});

connectToMongoDBUsingMongoose()
  .then(() => {
    console.log("Successfully connected to mongodb using mongoose");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("failed to connect to db");
  });
