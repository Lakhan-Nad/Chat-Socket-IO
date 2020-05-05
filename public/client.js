let socket = io();

let username_regex = /^[a-zA-Z0-9_]+$/;

let onlineUsers = new Set();

let username = prompt("Enter a Username", "");

while (true) {
  if (username.match(username_regex)) {
    socket.emit("enter", username);
    break;
  } else {
    username = prompt("Username is not valid.", "");
  }
}

socket.on("invalidUsername", () => {
  alert("Username already taken. Please refresh page to try again.");
});

socket.on("privateMessage", (username, msg) => {
  newChat(username, msg, true);
});

socket.on("publicMessage", (username, msg) => {
  newChat(username, msg);
});

socket.on("userList", (userList) => {
  onlineUsers.clear();
  userList.forEach((el) => onlineUsers.add(el));
  updateOnlineUserList();
});

socket.on("joinChat", (username) => {
  handleUser(username);
  onlineUsers.add(username);
  updateOnlineUserList();
});

socket.on("exitChat", (username) => {
  handleUser(username, false);
  onlineUsers.delete(username);
  updateOnlineUserList();
});

function sendMessage(msg) {
  socket.emit("sendMessage", msg);
}
