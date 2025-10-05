const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let savedNote = '';
let users = {}; // { username: password }

const upload = multer({ dest: path.join(__dirname, 'uploads') });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// Register API
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  users[username] = password;
  res.json({ success: true });
});

// Notes
app.post('/save', (req, res) => {
  savedNote = req.body.note || '';
  res.json({ status: 'saved' });
});

app.get('/load', (req, res) => {
  res.json({ note: savedNote });
});

// File Upload
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filename: req.file.filename });
});

// Real-time Chat
io.on('connection', socket => {
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Web OS running at http://localhost:${PORT}`));
