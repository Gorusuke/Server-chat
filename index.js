require("./mongo");
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

app.use("/api/users", userRoutes());
app.use("/api/login", loginRoutes());
app.use("/", messageRoutes());

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.info(`Escuchando en el puerto ${PORT}`));
