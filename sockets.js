const { now } = require("mongoose");
const Messages = require("./model/Messages");

module.exports = (io) => {
  let users = [];

  io.on("connection", (socket) => {
    socket.on("connected", (username) => {
      // console.info("Usuario conectado", username);
      socket.emit("message", {
        user: "admin",
        text: `@${username} welcome to this chat!`,
      });
      const user = {
        id: socket.id,
        username,
      };
      users.push(user);
    });

    socket.on("users", (callback) => {
      callback({ users });
    });

    socket.on("sendMessage", async (data, callback) => {
      const newMessage = new Messages({
        message: data.message,
        user: data.username,
      });
      await newMessage.save();
    });

    socket.on("disconnect", (callback) => {
      console.info(users);
      const removeUser = (id) => {
        const index = users.findIndex((user) => user.id === id);

        if (index !== -1) {
          return users.splice(index, 1)[0];
        }
      };
      const user = removeUser(socket.id);
      if (user) {
        console.info("desde Disconect");
        console.info(user.username);
        console.info(users);
        io.emit("message", {
          user: "admin",
          text: `@${user.username} Has left this chat`,
        });
        // callback({ users });
      }
    });
  });
};
