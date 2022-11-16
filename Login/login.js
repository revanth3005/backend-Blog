const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const user_model = require("../Schema-Models/userSchema");

const {
  isValidString,
  isValid,
  isValidObject,
  isValidEmail,
  SALT,
} = require("../utils/validators");

const userLogin = async (req, res) => {
  const response = {
    success: false,
    code: 400,
    data: null,
    message: "error",
    error: "error",
    resource: req.originalUrl,
  };

  const data = req.body;
  console.log(data);

  if (!isValid(data) || !isValidObject(data)) {
    response.message = "Invalid of sending data Provide required details";
    return res.status(400).json(response);
  }
  if (!isValid(data.email) || !isValidEmail(data.email)) {
    response.message = "Invalid provide the email";
    return res.status(400).json(response);
  }
  if (!isValid(data.password) || !isValidString(data.password)) {
    response.message = "Invalid provide the password";
    return res.status(400).json(response);
  }
  try {
    const emailCheck = await user_model.findOne({ emai: data.email });
    if (emailCheck == null) {
      response.message = "user not there";
      return res.status(200).json(response);
    }
    const passwordCompare = await bcrypt.compare(
      data.password,
      emailCheck.password
    );
    if (!passwordCompare) {
      response.message = "user password worng";
      return res.status(400).json(response);
    }

    //jwt token creation
    const token = jwt.sign({ id:emailCheck._id }, "sai-revanth-naidu");
    

    response.message = "Login Success.....";
    response.code = 200;
    response.error = null;
    response.data = { emailCheck, token };
    return res.status(200).json(response);
  } catch (error) {
    response.code = 500;
    response.message = error.message+"error from catch block";
    response.error = error;
    return res.status(500).json(response);
  }
};

module.exports = { userLogin };
