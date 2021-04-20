const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../model/User");

module.exports = function () {
  router.post("/", async (req, res) => {
    const { body } = req;
    const { password, email } = body;
    // console.info(req);

    const user = await User.findOne({ email });

    // Encriptando el password con bcrypt
    const correctPassword =
      user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && correctPassword)) {
      res.status(401).json({
        error: "Invalid user or password",
      });
    }

    const userForToken = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(userForToken, process.env.SECRETWORD, {
      expiresIn: 60 * 60,
    });

    res.send({
      username: user.username,
      token,
    });
  });

  return router;
};
