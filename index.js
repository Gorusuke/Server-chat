require("./mongo");
const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const router = require("./router");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { addUser, removeUser, getUser, users } = require("./helpers/users");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use("/api/users", userRoutes());
app.use("/", messageRoutes());

io.on("connection", (socket) => {
  socket.on("connected", (username) => {
    console.info("Usuario conectado", username);

    const { user } = addUser({ id: socket.id, username });

    socket.emit("message", {
      user: "admin",
      text: `@${user.username.split(" ")[0]} ${
        user.username.split(" ")[1]
      } welcome to this chat!`,
    });

    // socket.join(user.username);
  });

  socket.on("newUser", (username, callback) => {
    socket.broadcast.emit("user", {
      user: username,
      text: `@${username.split(" ")[0]}`,
    });

    callback({
      users,
    });
  });

  socket.on("sendMessage", (message) => {
    const user = getUser(socket.id);
    // console.info(user);

    io.emit("message", { user: user.username, text: message });
  });

  socket.on("disconnect", (callback) => {
    const user = removeUser(socket.id);
    if (user) {
      console.info(user.username);
      console.info(users);
      io.emit("messages", {
        user: "admin",
        text: `@${user.username.split(" ")[0]} ${
          user.username.split(" ")[1]
        } Has left this chat`,
      });
      // callback({
      //   users,
      // });
    }
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
