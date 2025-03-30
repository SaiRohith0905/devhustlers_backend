const express = require("express");
const {
  connectToMongoDBUsingMongoose,
} = require("./src/config/mongoose.config.js");
const app = express();

const { signUpValidator } = require("./src/utils/signUpValidator.js");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const UserModel = require("./src/models/UserModel.js");
const { jwtAuthMiddleware } = require("./src/middlewares/jwtAuthMiddleware.js");
/*express.json() --This middleware is provided by express, where it checks if each request.body has data of type JSON then it 
converts that data into javascript object and attaches to req.body and we can use that data in our server
Note:this middleware only works for req.body has data of type JSON, otherwise it will just igonre */
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.get("/user/getallusers", jwtAuthMiddleware, async (req, res) => {
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

app.put("/user/updateuser", jwtAuthMiddleware, async (req, res) => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "emailId",
    "skills",
  ];
  const { emailId, firstName, gender } = req.body;
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

    // const isUpdateAllowed = Object.keys(req.body).every((eachKey) => {
    //   return ALLOWED_UPDATES.includes(eachKey);
    // });

    // if (!isUpdateAllowed) {
    //   throw new Error("Update not allowed for some fields");
    // }

    const data = await UserModel.findOneAndUpdate(
      { emailId: emailId },
      { gender: gender },
      { returnDocument: "after", runValidators: true, context: "query" }
    );
    console.log(data);
    res.status(200).send("Document updated successfully:" + data);
  } catch (error) {
    console.log(error);
    res.status(400).send("error: " + error.message);
  }
});

app.post("/user/signup", async (req, res) => {
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

app.post("/user/signIn", async (req, res) => {
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

app.delete("/user/deleteuser", jwtAuthMiddleware, async (req, res) => {
  const { emailId } = req.body;

  try {
    await UserModel.findOneAndDelete({ emailId: emailId });
    res.send("User deleted successfully");
  } catch (error) {
    console.log("Error : " + error.message);
  }
});
// Application level Error
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Application error !! Something went wrong");
  }
});

//Connecting to MongoDB before even connecting to server so that there will be no issues.

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
