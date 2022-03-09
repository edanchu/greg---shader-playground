const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Project = require("../models/Project");
const { deleteOne, db } = require("../models/User");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");

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

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email"], session: false })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  function (req, res) {
    if (req.isAuthenticated()) {
      const { _id } = req.user;
      const token = signToken(_id);
      res.redirect("http://localhost:3000/GoogleCB/" + token);
    }
  }
);

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
        .json({ isAuthenticated: true, user: { _id, email, username } });
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
    const { _id, email, username, avatar } = req.user;
    res
      .status(200)
      .json({ isAuthenticated: true, user: { _id, email, username, avatar } });
  }
);

userRouter.get("/find-by-id/:id", (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send("database error");
    }
    const { _id, username, avatar } = user;
    res.send({ _id: _id, username: username, avatar: avatar });
  });
});

userRouter.put(
  "/update-avatar",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).send("Database error");
        }
        res.send(user);
      }
    );
  }
);

userRouter.post(
  "/add-project",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var newProject = new Project({
      owner: req.user._id,
      ownerName: req.user.username,
      title: req.body.title,
      description: req.body.description,
      public: req.body.public,
      likes: req.body.likes,
      code: req.body.code,
      channelUniforms: req.body.channelUniforms,
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
      (err, model) => {
        if (err) {
          console.log(err);
          res.status(500).send("database error");
        }
        res.send(newProject);
      }
    );
  }
);

userRouter.get("/get-project/:id", (req, res) => {
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
});

userRouter.put(
  "/update-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    filter = { _id: new mongoose.Types.ObjectId(req.params.id) };
    update = req.body;
    console.log(req.body);
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

userRouter.get("/get-projects", async (req, res) => {
  Project.find({ public: true })
    .sort({ likes: -1 })
    .exec((err, projects) => {
      if (err) {
        console.log(err);
        res.status(500).send("Database error");
      }
      res.send(projects);
    });
});

userRouter.get(
  "/get-self-projects",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.find({ owner: req.user._id }).exec((err, projects) => {
      if (err) {
        console.log(err);
        res.status(500).send("Database error");
      }
      res.send(projects);
    });
  }
);

userRouter.get("/get-user-projects/:id", async (req, res) => {
  Project.find({ public: true, owner: req.params.id }).exec((err, projects) => {
    if (err) {
      console.log(err);
      res.status(500).send("Database error");
    }
    res.send(projects);
  });
});

userRouter.delete(
  "/delete-project/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Project.findById(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      (err, project) => {
        if (err) {
          console.log(err);
          res.status(500).send("database error");
        }
        if (project.owner !== req.user._id) {
          res.send("you don't own this project!");
          return;
        } else {
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
      }
    );
  }
);

userRouter.post(
  "/add-comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var newComment = new Comment({
      owner: req.user._id,
      ownerName: req.user.username,
      ownerAvatar: req.user.avatar,
      content: req.body.content,
    });

    newComment.save((err, obj) => {
      if (err) {
        console.log(err);
        return res.status(500).send("database error");
      }
      console.log("added comment");
    });

    Project.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: newComment._id } },
      { safe: true, upsert: true, new: true },
      (err, model) => {
        if (err) {
          console.log(err);
          res.status(500).send("database error");
        }
        res.send(newComment);
      }
    );
  }
);

userRouter.get("/get-comments/:id", (req, res) => {
  Project.findById(req.params.id, async (err, project) => {
    if (err) {
      console.log(err);
      res.status(500).send("database error");
    }

    await Promise.all(
      project.comments.map((commentID) => Comment.findById(commentID))
    ).then((comments) => {
      res.send(comments);
    });
  });
});

userRouter.put(
  "/like-comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    filter = { _id: new mongoose.Types.ObjectId(req.params.commentId) };
    Comment.findById(filter, (err, comment) => {
      if (err) {
        console.log(err);
      }
      if (!comment.likes.includes(req.user._id)) {
        Comment.findByIdAndUpdate(
          filter,
          { $push: { likes: req.user._id } },
          { safe: true, upsert: true, new: true },
          (err, updatedComment) => {
            if (err) {
              console.log(err);
              res.status(500).send("database error");
            }
            res.send(updatedComment);
          }
        );
      } else {
        Comment.updateOne(
          filter,
          { $pull: { likes: req.user._id } },
          // { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } }
          (err, newLikes) => {
            if (err) {
              console.log(err);
              res.status(500).send("Database error");
            }
            res.send(newLikes);
          }
        );
      }
    });
  }
);

userRouter.post("/search", async (req, res) => {
  Project.find({ public: true })
    .sort({ likes: -1 })
    .exec((err, projects) => {
      if (err) {
        console.log(err);
        res.status(500).send("Database error");
      }
      console.log(req.body);
      filter = req.body.filter.toLowerCase();
      const search_result = projects.filter(
        (project) =>
          project.description.toLowerCase().includes(filter) ||
          project.title.toLowerCase().includes(filter) ||
          project.ownerName.toLowerCase().includes(filter)
      );
      res.send(search_result);
    });
});

module.exports = userRouter;
