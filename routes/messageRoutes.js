const express = require("express");
const router = express.Router();
const Messages = require("../model/Messages");
// const User = require('../models/User')

module.exports = function () {
  router.get("/", (req, res) => {
    // Obteniendo la pagina principal
    res.send("<h1>Welcome.!</h1>");
  });

  router.get("/api/messages", async (req, res) => {
    // Obteniendo todas las notas
    const messages = await Messages.find({});
    res.json(messages);
  });

  router.post("/api/messages", async (req, res, next) => {
    const { message, user } = req.body;

    if (!message) {
      res.status(400).json({ error: "message is missing" });
    }
    // Creando la nueva nota a guardar
    const newMessage = new Messages({
      message,
      user,
      date: new Date().toISOString(),
    });

    const saveMessage = await newMessage.save();
    res.status(201).json(saveMessage);
  });

  return router;
};
