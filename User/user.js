const user_model = require("../Schema-Models/userSchema");
const emailVerify_model = require("../Schema-Models/emailVerifySchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt=require('jsonwebtoken')

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


const {
  isValidString,
  isValid,
  isValidObject,
  isValidEmail,
  SALT,
} = require("../utils/validators");

//demo testing
const demo = async (req, res) => {
  const data = req.body;
  console.log(data);
};

//creating user
const createUser = async (req, res) => {
  const data = req.body;

  const response = {
    success: false,
    code: 400,
    data: null,
    message: "error",
    error: "error",
    resource: req.originalUrl,
  };

  if (!isValid(data) || !isValidObject(data)) {
    response.message = "Invalid of sending data Provide required details";
    return res.status(400).json(response);
  }
  if (!isValid(data.name) || !isValidString(data.name)) {
    response.message = "Invalid provide the name";
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

  //checking for mail
  try {
    const emailExist = await user_model.findOne({ email: data.email });
    if (emailExist) {
      response.message = "Email is exist provide new one";
      return res.status(400).json(response);
    }
  } catch (error) {
    response.code = 500;
    response.error = error;
    return res.status(500).json(response);
  }

  //hashPassword
  const hashPassword = await bcrypt.hash(data.password.trim(), SALT);
  //storing all the details in user object
  const user = {
    name: data.name,
    email: data.email,
    password: hashPassword,
    verified: false,
    isVerified: false,
  };


  try {
    const userData = new user_model(user);
    await userData.save();

    //nodemailer
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "revanthnsrn@gmail.com",
        pass: "cjmlujbmcvsqkluf",
      },
    });

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    // const otp = (limit) =>{
    //     let digits='0123456789'
    //     let OTP=''
    //     for(let i=0; i<limit; i++){
    //         OTP +=digits[Math.floor(Math.random() * 10)]
    //     }
    //     return OTP
    // }
    // let valueOtp=otp(4)
    let mailoptions = {
      from: "revanthnsrn@gmail.com",
      to: user.email,
      subject: "Verification Mail from NODEMAILER",
      text: `Enter the OPT to verify the email----${otp}`,
    };
    transporter.sendMail(mailoptions, (error, info) => {
      if (error) {
        throw console.error(error);
      } else {
        console.log(info);
      }
    });

    //saving the details in emailVerifydetails object for creating in emailVerify_model
    const emailVerifydetails = {
      email: user.email,
      otp: otp,
      verified: false,
    };
    //saving the details in emailVerify_model
    const emailVerifyingData = new emailVerify_model(emailVerifydetails);
    await emailVerifyingData.save();

    

    return res.status(200).json({
      success: true,
      status: "PENDING",
      code: 200,
      data: userData,
      message: "user created but pending for verification",
      error: null,
      resource: req.originalUrl,
    });
  } catch (error) {
    response.code = "500";
    response.error = error;
    response.message = "from catch block"+error.message;
    return res.status(500).json(response);
  }
};

// for verifying the email
const verifyEmailOtp = async (req, res) => {
  const email = req.params.email;
  const otp = req.params.otp;

  //finding the email
  try {
    const findEmail = await emailVerify_model.findOne({
      email: email,
      otp: otp,
    });
    if (findEmail) {
      findEmail.verifyed = true;
      await findEmail.save();

      const findUserEmail = await user_model.findOne({ email: email });
      findUserEmail.verified = true;
      findUserEmail.emailStatus = "APPROVED";
      findUserEmail.isVerifiedAt = Date.now();
      await findUserEmail.save();

      return res.status(200).json({
        success: true,
        code: 200,
        data: findEmail,
        dataUser: findUserEmail,
        error: null,
        message: "data retrived",
        resource: req.originalUrl,
      });
    } else {
      return res.status(400).json({
        success: false,
        code: 400,
        data: null,
        error: "no data found",
        message: "data not there",
        resource: req.originalUrl,
      });
    }
  } catch (error) {
    // console.error(error);
  }
};

module.exports = {
  demo,
  createUser,
  verifyEmailOtp,
};
