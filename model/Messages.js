const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
  message: String,
  date: Date,
  user: String,
});

messagesSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Añadiendo el mismo _id a id
    returnedObject.id = returnedObject._id;
    // Eliminando _id y __v
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Messages = mongoose.model("Message", messagesSchema);

module.exports = Messages;
