require("dotenv").config(); // config environmental variables

const http = require("http");
const express = require("express");
const sio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = sio(server);

app.use("/", express.static(path.join(__dirname, "public")));

let users = new Map();

io.sockets.on("connection", (socket) => {
  socket.on("enter", (username) => {
    if (users.has(username)) {
      socket.emit("invalidUsername");
      socket.disconnect();
    } else {
      users.set(username, socket.id);
      socket.username = username;
      let userList = [];
      for (let user of users) {
        userList.push(user[0]);
      }
      socket.emit("userList", userList);
      io.emit("joinChat", socket.username);
    }
  });

  socket.on("disconnect", () => {
    users.delete(socket.username);
    io.emit("exitChat", socket.username);
  });

  socket.on("sendMessage", (msg) => {
    [isAll, userList] = getSendList(msg);
    if (isAll) {
      io.emit("publicMessage", socket.username, msg);
    } else {
      for (user of userList) {
        if (user == socket.username) continue;
        if (users.has(user))
          io.to(users.get(user)).emit("privateMessage", socket.username, msg);
      }
      socket.emit("privateMessage", socket.username, msg);
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server Listening on port: ${process.env.PORT}`);
});

function getSendList(msg) {
  let isAll = true;
  let userList = new Set();
  let username_regex = /^[a-zA-Z0-9_]$/;
  let inside = false;
  let insideString = false;
  let close_char;
  for (let i = 0; i < msg.length; i++) {
    if (!inside && !insideString && msg[i] == "`") {
      inside = true;
      close_char = "`";
    } else if (!inside && !insideString && msg[i] == "*") {
      inside = true;
      close_char = "*";
    } else if (!inside && !insideString && msg[i] == "_") {
      inside = true;
      close_char = "_";
    } else if (inside && !insideString && msg[i] == close_char) {
      inside = false;
    } else if (!insideString && msg[i] == '"') {
      insideString = true;
    } else if (insideString && msg[i] == '"') {
      insideString = false;
    } else if (!insideString && !inside && msg[i] == "@") {
      let username = "";
      i++;
      while (i < msg.length && username_regex.test(msg[i])) {
        username = username + msg[i];
        i++;
      }
      userList.add(username);
      isAll = false;
      i--;
    }
  }
  return [isAll, userList];
}
