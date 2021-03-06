const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const api = require('./routes/index.js');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils');

const PORT = process.env.port || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

app.use(express.static('public'));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '/public/404.html'));
})

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/feedback', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/pages/feedback.html'))
);

// POST Route for diagnostics
app.post('/api/diagnostics', (req, res) => {
  readAndAppend(req.body, path.join(__dirname, '/db/diagnostics.json'));
  res.json({ status: "success" });
});

app.get('/api/diagnostics', (req, res) => {
  readFromFile(path.join(__dirname, '/db/diagnostics.json'))
  .then(data => res.json(JSON.parse(data)));
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
