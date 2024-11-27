const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//!for file mode

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false);
    }
};

const upload = multer({ storage, fileFilter });
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      console.log(filePath)
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      console.log(fileUrl)
  
      // Schedule file deletion after 3 minutes
      setTimeout(() => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Failed to delete file ${filePath}:`, err);
          } else {
            console.log(`File ${filePath} deleted successfully`);
          }
        });
      }, 3 * 60 * 1000); // 3 minutes in milliseconds
  
      res.json({ imageUrl: fileUrl });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

//! For url mode
app.post('/api/recognize', (req, res) => {
  const { imageUrl } = req.body;

  const options = {
    method: 'POST',
    hostname: 'zyanyatech1-license-plate-recognition-v1.p.rapidapi.com',
    path: `/recognize_url?image_url=${encodeURIComponent(imageUrl)}`,
    headers: {
      'x-rapidapi-key': '7a7ebf1336msh16478ec3f13373ep18e039jsnb604706f295f',
      'x-rapidapi-host': 'zyanyatech1-license-plate-recognition-v1.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
  };

  const request = https.request(options, (response) => {
    const chunks = [];
    response.on('data', (chunk) => chunks.push(chunk));
    response.on('end', () => res.json(JSON.parse(Buffer.concat(chunks).toString())));
  });

  request.on('error', (error) => {
    res.status(500).json({ error: error.message });
  });

  request.write(JSON.stringify({}));
  request.end();
});

app.listen(5000, () => console.log('Server running on port 5000'));
