const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../model/User");

module.exports = function () {
  router.get("/", async (req, res) => {
    const users = await User.find({});
    res.json(users);
  });

  router.post("/", async (req, res) => {
    const { body } = req;
    const { username, email, password } = body;

    // Encriptando el password con bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  });

  return router;
};
