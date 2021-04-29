const Messages = require("./model/Messages");
// const { addUser, removeUser, getUser, users } = require("./helpers/users");

module.exports = (io) => {
  let users = [];

  io.on("connection", (socket) => {
    // let mensajes = Messages.find({}).limit(10).sort("-date");

    // socket.emit("load old messages", mensajes);

    socket.on("newUser", (data, callback) => {
      // if (data in users) {
      //   callback(false);
      // } else {
      //   callback(true);
      //   socket.username = data;
      //   user[socket.username] = socket;
      //   updateUsers();
      // }
      // console.info(users);
    });

    socket.on("connected", (username) => {
      console.info("Usuario conectado", username);
      socket.emit("message", {
        user: "admin",
        text: `@${username} welcome to this chat!`,
      });
      const user = {
        id: socket.id,
        username,
      };
      users.push(user);
      console.info(users);

      // socket.join(user.username);
    });

    socket.on("users", (callback) => {
      callback({ users });
    });

    socket.on("sendMessage", async (data, callback) => {
      const newMessage = new Messages({
        message: data.message,
        user: data.username,
        date: new Date().toISOString(),
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

    // socket.on("disconnect", (data) => {
    //   if (!socket.username) return;
    //   delete users[socket.username];
    //   updateUsers();
    // });

    // function updateUsers(params) {
    //   io.socket.emit("usernames", Object.keys(users));
    // }
  });
};
