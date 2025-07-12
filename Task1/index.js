// index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { askGemini } = require('./geminiService');

const upload = multer({ dest: 'uploads/' });
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

app.get('/', (req, res) => {
  res.render('index', { messages });
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  messages.push({ role: 'user', content: userMessage });

  try {
    const botReply = await askGemini(userMessage);
    messages.push({ role: 'assistant', content: botReply });
  } catch (err) {
    console.error(err);
    messages.push({ role: 'assistant', content: 'Error getting response from Gemini.' });
  }

  res.redirect('/');
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

