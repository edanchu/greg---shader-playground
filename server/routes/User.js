const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");
const { deleteOne } = require("../models/User");
const mongoose = require("mongoose");

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "greg",
      sub: userID,
    },
    "greg",
    { expiresIn: "1hr" }
  );
};

userRouter.post("/register", (req, res) => {
  const { email, username, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err)
      res.status(500).json({
        message: { msgBody: "Server error has occured", msgError: true },
      });
    if (user)
      res.status(400).json({
        message: { msgBody: "Email is already in use", msgError: true },
      });
    else {
      const newUser = new User({ email, username, password });
      newUser.save((err) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: { msgBody: "Could not save user", msgError: true },
          });
        } else
          res.status(201).json({
            message: {
              msgBody: "Account successfully created",
              msgError: false,
            },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, email, username } = req.user;
      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res
        .status(200)
        .json({ isAuthenticated: true, user: { email, username } });
    }
  }
);

userRouter.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { email: "", name: "" }, success: true });
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { email, username } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { email, username } });
  }
);

userRouter.post(
  "/add-project",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var newProject = new Project({
      owner: req.user._id,
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      public: req.body.public,
    });

    newProject.save((err, obj) => {
      if (err) {
        console.log(err);
        return res.status(500).send("database error");
      }
      console.log("added project");
    });

    User.findByIdAndUpdate(
      req.user._id,
      { $push: { projects: newProject._id } },
      { safe: true, upsert: true, new: true },
      function (err, model) {
        console.log(err);
      }
    );
    res.send(newProject);
  }
);

userRouter.get(
  "/get-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      (err, project) => {
        if (err) {
          console.log(err);
          res.status(500).send("database error");
        }
        res.send(project);
      }
    );
  }
);

userRouter.put(
  "/update-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.body);
    filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
    update = req.body;
    Project.findOneAndUpdate(
      filter,
      update,
      { new: true },
      (err, updatedProject) => {
        if (err) {
          console.log(err);
          res.status(500).send("Database error");
        }
        console.log("updated");
        res.send(updatedProject);
      }
    );
  }
);

userRouter.delete(
  "/delete-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findOneAndDelete(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      (err, project) => {
        if (err) {
          console.log(err);
          res.status(500).send("Database error");
        }
        console.log("succesfully deleted project " + req.params.id);
      }
    );

    User.updateOne(
      { _id: req.user._id },
      {
        $pullAll: {
          projects: [{ _id: new mongoose.Types.ObjectId(req.params.id) }],
        },
      },
      (err, deletedProject) => {
        if (err) {
          console.log(err);
          res.status(500).send("Database error");
        }
        res.send(deletedProject);
      }
    );
  }
);

module.exports = userRouter;
