const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
let savedNote = '';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', (req, res) => {
  savedNote = req.body.note || '';
  res.json({ status: 'saved' });
});

app.get('/load', (req, res) => {
  res.json({ note: savedNote });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Web OS running at http://localhost:\${PORT}\`));
