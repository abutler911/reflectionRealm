// server.js
const express = require('express');
const path = require('path');
require('dotenv').config();

// Import database connection
require('./config/db');

const app = express();
const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

// Middleware setup
app.use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

// Routes
app.use('/', require('./routes'));

// Error handling middleware (should be last)
app.use((req, res) => {
  res.status(404).render('404', { path: req.path });
});

// Start server
app.listen(port, () => {
  console.log(`ReflectionRealm blog running at http://localhost:${port}`);
});