function updateOnlineUserList() {
  let x = document.getElementById("list");
  let html = "<h1>Online Users</h1>";
  for (user of onlineUsers) {
    html = html + `<h2 class="${user === username ? "me" : ""}">${user}</h2>`;
  }
  x.innerHTML = html;
}

let form = document.getElementById("form");
let messageBox = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let box = form.getElementsByTagName("textarea")[0];
  if (box.value === "") {
    return;
  }
  sendMessage(box.value);
  box.value = "";
});

function newChat(user, msg, private = false) {
  let chat = document.createElement("div");
  chat.classList.add("chat");
  if (private) {
    chat.classList.add("private");
  } else {
    chat.classList.add("public");
  }
  if (username == user) {
    chat.classList.add("sent");
  }
  chat.innerHTML = `<h1>${user}</h1>` + sanitizeMessage(msg);
  messageBox.appendChild(chat);
}

function handleUser(user, join = true) {
  let el = document.createElement("div");
  el.classList.add("info");
  let action = "";
  if (join) {
    el.classList.add("join");
    action = "joined";
  } else {
    el.classList.add("left");
    action = "left";
  }
  if (username == user) {
    el.innerHTML = `<span>You</span> ${action} the Chat`;
  } else {
    el.innerHTML = `<span>${user}</span> ${action} the Chat`;
  }
  messageBox.appendChild(el);
}
