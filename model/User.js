const mongooseUniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: String,
  passwordHash: String,
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    // Añadiendo el mismo _id a id
    returnedObject.id = returnedObject._id;
    // Eliminando _id y __v
    delete returnedObject._id;
    delete returnedObject.__v;

    delete returnedObject.passwordHash;
  },
});

userSchema.plugin(mongooseUniqueValidator);

const User = model("User", userSchema);

module.exports = User;
