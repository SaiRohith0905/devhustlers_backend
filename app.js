const express = require("express");
const {
  connectToMongoDBUsingMongoose,
} = require("./src/config/mongoose.config.js");
const app = express();
const { authRouter } = require("./src/Routes/authRoute.js");
const cookieParser = require("cookie-parser");
const { jwtAuthMiddleware } = require("./src/middlewares/jwtAuthMiddleware.js");
const { profileRouter } = require("./src/Routes/profileRoute.js");
const connectionRequestRouter = require("./src/Routes/connectionRequestRoute.js");

/*express.json() --This middleware is provided by express, where it checks if each request.body has data of type JSON then it 
converts that data into javascript object and attaches to req.body and we can use that data in our server
Note:this middleware only works for req.body has data of type JSON, otherwise it will just igonre */
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", jwtAuthMiddleware, profileRouter);
app.use("/request", jwtAuthMiddleware, connectionRequestRouter);
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
