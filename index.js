const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001; // Use environment variable for port

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'images'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.originalname.split('.').pop();
    cb(null, `${timestamp}-${randomString}.${extension}`);
  },
});

const upload = multer({ storage });

// Serve static files from the "public" folder
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Endpoint to handle file uploads
  app.post('/upload', upload.single('image'), (req, res) => {
 // console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ filePath: req.file.filename });


  // Extract just the filename (e.g., "image.jpg") instead of the full path
  const fileName = req.file.filename;

  // Return the full URL to the client
  const fileUrl = `${req.protocol}://${req.get('host')}/images/${fileName}`;
  res.json({ fileUrl });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
