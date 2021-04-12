const users = [];

const addUser = ({ id, username }) => {
  username = username.split(" ")[0];

  const user = { id, username };
  // const index = users.find((user) => user.username === username);

  // if (index !== username) {
  //   return users;
  // } else {
  // }
  users.push(user);
  // console.info(index !== username);
  // console.info(username);
  // console.info(index);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

module.exports = { addUser, removeUser, getUser, users };
