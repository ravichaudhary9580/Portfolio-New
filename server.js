// Simple Node.js server for image upload
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Handle image upload
app.post('/upload-verification', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const timestamp = req.body.timestamp;
  const filename = `verification_${timestamp}.jpg`;
  const newPath = path.join('uploads', filename);

  // Move file to permanent location
  fs.renameSync(req.file.path, newPath);

  res.json({ 
    success: true, 
    filename: filename,
    url: `/uploads/${filename}`
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});