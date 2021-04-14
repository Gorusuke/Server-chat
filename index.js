const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const router = require("./router");
const { addUser, removeUser, getUser, users } = require("./helpers/users");

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

    socket.emit("message", {
      user: "admin",
      text: `@${user.username} welcome to this chat!`,
    });

    // socket.broadcast.emit("message", {
    //   user: "admin",
    //   text: `@${user.username} Has joined the chat, say hello`,
    // });

    socket.join(user.username);
  });

  socket.on("newUser", (username, callback) => {
    socket.broadcast.emit("user", {
      text: `@${username.split(" ")[0]}`,
    });

    callback({
      users,
    });
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    console.info(user);

    io.emit("message", { user: user.username, text: message });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.emit("messages", {
        user: "admin",
        message: `@${name} Has left`,
      });
    }
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
