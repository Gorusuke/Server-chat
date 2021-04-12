const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const router = require("./router");
const { addUser, removeUser, getUser } = require("./helpers/users");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use("/", router());

io.on("connection", (socket) => {
  let name;

  socket.on("connected", (username, callback) => {
    name = username;
    console.info("Usuario conectado", name);

    const { user } = addUser({ id: socket.id, username });

    socket.broadcast.emit("message", {
      user: "admin",
      text: `@${user.username} welcome to this chat!`,
    });

    socket.broadcast.emit("messages", {
      name: name,
      text: `@${name} se ha conectado al chat, Saludalo!`,
    });

    socket.join(user.username);

    // callback();
  });

  // socket.on("newUser", (message) => {
  //   const user = getUser(socket.id);
  //   console.info(user);

  //   io.emit("message", { user: user.username, text: message });

  //   // callback();
  // });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    console.info(user);

    io.emit("message", { user: user.username, text: message });

    // callback();
  });

  // socket.on("sendMessage", (username, message) => {
  //   io.emit("messages", { username, message });
  // });

  socket.on("disconnect", () => {
    io.emit("messages", {
      servidor: "servidor",
      message: `@${name} Ha abandonado la sala`,
    });
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
