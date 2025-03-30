const validator = require("validator");

function signUpValidator(req) {
  const { firstName, lastName, emailId, password } = req.body;

  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Please enter a valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
}

module.exports = { signUpValidator };
