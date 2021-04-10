const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

// server.use("/", (req, res) => {
//   res.send("<h1>Hola Desde Node</h1>");
// });

io.on("connection", (socket) => {
  socket.on("conectado", (payload) => {
    console.info("Usuario conectado", payload);
    io.emit("conectado", payload);
  });

  socket.on("message", (username, message) => {
    io.emit("messages", { username, message });
  });

  socket.on("disconnect", () => {
    io.emit("messages", {
      servidor: "servidor",
      message: "Ha abandonado la sala",
    });
  });
});

const PORT = 4000;
server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
