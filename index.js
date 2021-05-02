require("./mongo");
require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const loginRoutes = require("./routes/loginRoutes");

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

require("./sockets")(io);

app.use(cors());
app.use(express.json());

app.use("/", messageRoutes());
app.use("/api/users", userRoutes());
app.use("/api/login", loginRoutes());

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
