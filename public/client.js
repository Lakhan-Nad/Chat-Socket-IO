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

socket.on("privateMessage", (username, msg, time) => {
  newChat(username, msg, time, true);
});

socket.on("publicMessage", (username, msg, time) => {
  newChat(username, msg, time);
});

socket.on("userList", (userList) => {
  onlineUsers.clear();
  userList.forEach((el) => onlineUsers.add(el));
  updateOnlineUserList();
});

socket.on("joinChat", (username) => {
  if (typeof username !== "string") {
    return;
  }
  handleUser(username);
  onlineUsers.add(username);
  updateOnlineUserList();
});

socket.on("exitChat", (username) => {
  if (typeof username !== "string") {
    return;
  }
  handleUser(username, false);
  onlineUsers.delete(username);
  updateOnlineUserList();
});

function sendMessage(msg) {
  socket.emit("sendMessage", msg);
}
