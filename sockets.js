const Messages = require("./model/Messages");
// const { addUser, removeUser, getUser, users } = require("./helpers/users");

module.exports = (io) => {
  let users = {};

  io.on("connection", async (socket) => {
    let mensajes = await Messages.find({}).limit(40).sort("-date");

    socket.emit("load old messages", mensajes);

    // socket.on("connected", (username) => {
    //   console.info("Usuario conectado", username);

    //   const { user } = addUser({ id: socket.id, username });

    //   socket.emit("message", {
    //     user: "admin",
    //     text: `@${user.username} welcome to this chat!`,
    //   });

    //   // socket.join(user.username);
    // });

    // socket.on("newUser", (data, callback) => {
    //   socket.broadcast.emit("user", {
    //     user: username,
    //     text: `@${username}`,
    //   });

    //   callback({
    //     users,
    //   });
    // });

    socket.on("newUser", (data, callback) => {
      if (data in users) {
        callback(false);
      } else {
        callback(true);
        socket.username = data;
        user[socket.username] = socket;
        updateUsers();
      }
    });

    // socket.on("sendMessage", (message) => {
    //   const user = getUser(socket.id);
    //   // console.info(user);

    //   io.emit("message", { user: user.username, text: message });
    // });

    socket.on("sendMessage", async (data, callback) => {
      let msg = data.trim();

      if (msg.substr(0, 3) === "/w ") {
        msg = msg.substr(3);
        let index = msg.indexOf(" ");
        if (index !== -1) {
          let name = msg.substring(0, index);
          msg = substring(index + 1);
          if (name in users) {
            user[name].emit("whisper", {
              msg,
              user: socket.username,
            });
          } else {
            callback("Error! Enter a valid User");
          }
        } else {
          callback("Error! Please enter your message");
        }
      } else {
        let newMessage = new Messages({
          message: msg,
          user: socket.username,
        });
        await newMessage.save();

        io.socket.emit("new message", { user: user.username, message });
      }
    });

    // socket.on("disconnect", (callback) => {
    //   const user = removeUser(socket.id);
    //   if (user) {
    //     console.info(user.username);
    //     console.info(users);
    //     io.emit("messages", {
    //       user: "admin",
    //       text: `@${user.username} Has left this chat`,
    //     });
    //     // callback({
    //     //   users,
    //     // });
    //   }
    // });

    socket.on("disconnect", (data) => {
      if (!socket.username) return;
      delete users[socket.username];
      updateUsers();
    });

    function updateUsers(params) {
      io.socket.emit("usernames", Object.keys(users));
    }
  });
};
