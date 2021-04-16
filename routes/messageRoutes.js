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

  // router.get("/api/notes/:id", (req, res, next) => {
  //   const { id } = req.params;
  //   // Obteniendo las notas por id
  //   Note.findById(id)
  //     .then((note) => {
  //       if (note) {
  //         res.json(note);
  //       } else {
  //         res.status(404).end();
  //       }
  //     })
  //     .catch((err) => next(err));
  // });

  router.post("/api/messages", async (req, res, next) => {
    const { message, user } = req.body;

    // const user = await User.findById(userId);

    if (!message) {
      res.status(400).json({ error: "message is missing" });
    }
    // Creando la nueva nota a guardar
    const newMessage = new Message({
      message,
      user,
      date: new Date().toISOString(),
      user: user._id,
    });
    // Guardando la nueva nota
    // if(newNote.content){
    //   newNote.save()
    //     .then((saveNote) => res.status(201).json(saveNote))
    //
    try {
      if (newMessage.message) {
        await newMessage.save();
        res.status(201).json(saveNote);
      }
    } catch (error) {
      console.info(error);
    }
  });

  // router.put("/api/notes/:id", (req, res, next) => {
  //   const { id } = req.params;
  //   const note = req.body;

  //   const newNoteInfo = {
  //     content: note.content,
  //     important: note.important,
  //   };
  //   // Actualizando por Id y mostrando el nuevo objeto
  //   Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
  //     .then((result) => res.json(result))
  //     .catch((err) => next(err));
  // });

  // router.delete("/api/notes/:id", async (req, res, next) => {
  //   const { id } = req.params;
  //   // Eliminando por id
  //   Note.findByIdAndDelete(id)
  //     .then(() => res.status(404).end())
  //     .catch((err) => next(err));

  //   // const result = await Note.findByIdAndDelete(id)
  //   // if (result === null) return res.sendStatus(404)
  //   // res.status(204).end()
  // });

  // router.use((req, res, next) => {
  //   res.status(404).end();
  // });

  // router.use((err, req, res, next) => {
  //   console.error(err);

  //   if (err) {
  //     res.status(400).send({ error: "El ID esta mal" });
  //   } else {
  //     res.status(500).end();
  //   }
  // });

  return router;
};
