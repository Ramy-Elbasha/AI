require('dotenv').config();
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const  {askGemini,askGeminiWithFile} = require('./geminiService');

const upload = multer({ dest: 'uploads/' });

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let messages = [];

app.get('/', (req, res) => {
  res.render('index', { messages });
});

app.post('/chat', upload.single('file'), async (req, res) => {
  const userMessage = req.body.message;
  const filePath = req.file?.path;

  messages.push({ role: 'user', content: userMessage });

  try {
    let botReply;
    if (filePath) {
      botReply = await askGeminiWithFile(userMessage, filePath);
    } else {
    

      botReply = await askGemini(userMessage)
    }

    messages.push({ role: 'assistant', content: botReply });
  } catch (err) {
    console.error(err);
    messages.push({ role: 'assistant', content: 'Error getting response from Gemini.' });
  } finally {
    if (filePath) fs.unlink(filePath, () => {});
  }

  res.redirect('/');
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
