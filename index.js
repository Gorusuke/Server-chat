const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server, {
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
});

const PORT = 4500;
server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
