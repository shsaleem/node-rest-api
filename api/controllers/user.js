import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import _ from "lodash";

import User from "../models/user.js";
import sendEmail from "../utils/sendEmail.js";

// Get All Users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("_id email");
    res.status(200).json({
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: "No user exist",
    });
  }
};

// Sign up
const userSignUp = (req, res, next) => {
  const { name, phone, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    const token = jwt.sign(
      { name, phone, email, password },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    sendEmail(
      email,
      "Email Verfication",
      `
      <h2>Activate Your Account
      </h2><p><b>Token:</b> ${token}</p>
      `
    )
      .then(() =>
        res
          .status(201)
          .json({ message: `Verification email has been sent to ${email}` })
      )
      .catch((error) => {
        res.status(500).json({
          error,
          message: "Email could not be sent",
        });
      });
  });
};

//Verify Email
const verifyEmail = (req, res, next) => {
  const { token } = req.body;
  if (token) {
    jwt.verify(token, process.env.JWT_KEY, (err, decodedToken) => {
      if (err) {
        return res.statu(400).json({
          message: "Incorrrect or Expired token",
        });
      }
      const { name, email, phone, password } = decodedToken;
      User.find({ email })
        .exec()
        .then((user) => {
          if (user.length >= 1) {
            return res.status(409).json({
              message: "Mail already exist",
            });
          } else {
            bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err,
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  name,
                  phone,
                  email,
                  password: hash,
                });
                user
                  .save()
                  .then((result) => {
                    res.status(201).json({
                      message: "User Successfuly Signed Up!",
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).json({
                      error: err,
                    });
                  });
              }
            });
          }
        });
    });
  } else {
    return res.statu(500).json({
      message: "Invalid Token",
    });
  }
};

// User Login
const userLogIn = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login failed.",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Login failed.",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );
          console.log(result);
          return res.status(200).json({
            message: "Login successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Login failed.",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

// Delete a user
const userDelete = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.deleteOne({ _id: userId });
    res.status(200).json({
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};

// Forget Password
const forgotPasswrod = (req, res, next) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (!user || err) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD_KEY,
      {
        expiresIn: "1h",
      }
    );

    return User.updateOne({ resetToken: token }, (err, success) => {
      if (err) {
        res.status(400).json({ message: "Error" });
      } else {
        sendEmail(
          email,
          "Email Verfication",
          `
      <h2>Activate Your Account</h2>
      <p><b>Token:</b>${token}</p>
      `
        )
          .then(() =>
            res.status(201).json({
              message: `Verification email has been sent to ${email}`,
            })
          )
          .catch((error) => {
            res.statu(500).json({
              error,
              message: "Email could not be sent",
            });
          });
      }
    });
  });
};

// Reset Password
const resetPasswrod = (req, res, next) => {
  const { token, newPassword } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_RESET_PASSWORD_KEY,
      (err, decodedData) => {
        if (err) {
          return res.status(401).json({ message: "Invalid Token" });
        }

        User.findOne({ token }, (err, user) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ message: "Token doesnot match with any user" });
          }

          bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const updatedUser = {
                password: hash,
                resetToken: "",
              };
              user = _.extend(user, updatedUser);

              user
                .save()
                .then((result) => {
                  res.status(201).json({
                    message: "Password changed!",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        });
      }
    );
  } else {
    return res.status(401).json({ message: "Send token." });
  }
};

export {
  getAllUsers,
  userSignUp,
  userLogIn,
  verifyEmail,
  forgotPasswrod,
  resetPasswrod,
  userDelete,
};
