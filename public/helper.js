function sanitizeMessage(msg) {
  let username_regex = /^[a-zA-Z0-9_]$/;
  let html = "";
  let inside = false;
  let insideString = false;
  let close_char = "";
  for (let i = 0; i < msg.length; i++) {
    if (msg[i] == " ") {
      html = html + "&nbsp;";
    } else if (msg[i] == "\n") {
      html = html + "<br />";
    } else if (msg[i] == "<") {
      html = html + "&lt;";
    } else if (msg[i] == ">") {
      html = html + "&gt;";
    } else if (!inside && !insideString && msg[i] == "`") {
      html = html + "<mark>";
      inside = true;
      close_char = "`";
    } else if (inside && !insideString && msg[i] == "`" && close_char == "`") {
      html = html + "</mark>";
      inside = false;
    } else if (!inside && !insideString && msg[i] == "*") {
      html = html + "<strong>";
      inside = true;
      close_char = "*";
    } else if (inside && !insideString && msg[i] == "*" && close_char == "*") {
      html = html + "</strong>";
      inside = false;
    } else if (!inside && !insideString && msg[i] == "_") {
      html = html + "<em>";
      inside = true;
      close_char = "_";
    } else if (inside && !insideString && msg[i] == "_" && close_char == "_") {
      html = html + "</em>";
      inside = false;
    } else if (!insideString && msg[i] == '"') {
      html = html + '"';
      insideString = true;
    } else if (insideString && msg[i] == '"') {
      html = html + '"';
      insideString = false;
    } else if (!insideString && !inside && msg[i] == "@") {
      html = html + '@<span class="username">';
      i++;
      while (i < msg.length && username_regex.test(msg[i])) {
        html = html + msg[i];
        i++;
      }
      html = html + "</span>";
      i--;
    } else {
      html = html + msg[i];
    }
  }
  if (inside) {
    if (close_char == "`") {
      html = html + "</mark>";
    } else if (close_char == "*") {
      html = html + "</strong>";
    } else if (close_char == "_") {
      html = html + "</em>";
    }
  }
  return html;
}

function timeFormat(time) {
  let date = new Date(time);
  let dd = (date.getDate() + "").padStart(2, "0");
  let mm = (date.getMonth() + 1 + "").padStart(2, "0");
  let yyyy = date.getFullYear() + "";

  let tm =
    (date.getHours() + "").padStart(2, "0") +
    ":" +
    (date.getMinutes() + "").padStart(2, "0");

  return dd + "/" + mm + "/" + yyyy + " " + tm;
}
