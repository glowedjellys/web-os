function openApp(appName) {
  const win = document.createElement('div');
  win.className = 'window';
  win.style.top = '100px';
  win.style.left = '100px';

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerText = appName;
  win.appendChild(header);

  const content = document.createElement('div');
  content.innerHTML = getAppContent(appName);
  win.appendChild(content);

  document.body.appendChild(win);
  makeDraggable(win, header);
}

function getAppContent(app) {
  if (app === 'notes') {
    return `<textarea id="noteArea"></textarea><br/>
            <button onclick="saveNote()">Save</button>
            <button onclick="loadNote()">Load</button>`;
  }
  if (app === 'calculator') {
    return `<input id="calcInput"/><button onclick="calculate()">=</button><div id="calcResult"></div>`;
  }
  if (app === 'login') {
    return `<input id="username" placeholder="Username"/><br/>
            <input id="password" type="password" placeholder="Password"/><br/>
            <button onclick="login()">Login</button>
            <button onclick="register()">Register</button>`;
  }
  if (app === 'upload') {
    return `<input type="file" id="fileInput"/><button onclick="uploadFile()">Upload</button>`;
  }
  if (app === 'chat') {
    return `<div id="chatBox" style="height:100px;overflow:auto;border:1px solid #ccc;"></div>
            <input id="chatInput"/><button onclick="sendChat()">Send</button>`;
  }
  return 'App not found';
}

// Notes
function saveNote() {
  const note = document.getElementById('noteArea').value;
  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note })
  });
}

function loadNote() {
  fetch('/load')
    .then(res => res.json())
    .then(data => {
      document.getElementById('noteArea').value = data.note;
    });
}

// Calculator
function calculate() {
  const input = document.getElementById('calcInput').value;
  try {
    document.getElementById('calcResult').innerText = eval(input);
  } catch {
    document.getElementById('calcResult').innerText = 'Error';
  }
}

// Login/Register
function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    alert(data.success ? 'Login successful' : 'Login failed');
  });
}

function register() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(res => res.json()).then(data => {
    alert('Registered!');
  });
}

// File Upload
function uploadFile() {
  const file = document.getElementById('fileInput').files[0];
  const formData = new FormData();
  formData.append('file', file);
  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then(res => res.json()).then(data => {
    alert('Uploaded: ' + data.filename);
  });
}

// Real-time Chat
function sendChat() {
  const msg = document.getElementById('chatInput').value;
  socket.emit('chat message', msg);
  document.getElementById('chatInput').value = '';
}

const socket = io();
socket.on('chat message', msg => {
  const box = document.getElementById('chatBox');
  if (box) {
    box.innerHTML += '<div>' + msg + '</div>';
    box.scrollTop = box.scrollHeight;
  }
});

// Dragging windows
function makeDraggable(win, header) {
  let offsetX, offsetY;
  header.onmousedown = function(e) {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.onmousemove = function(e) {
      win.style.left = e.clientX - offsetX + 'px';
      win.style.top = e.clientY - offsetY + 'px';
    };
    document.onmouseup = function() {
      document.onmousemove = null;
    };
  };
}
