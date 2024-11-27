const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require("cors");

// Setup
const app = express();
const PORT = 5000;
app.use(cors());

// Multer setup for handling multipart/form-data
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to upload image and call Plate Recognizer API
app.post("/upload-image", upload.single("upload"), async (req, res) => {
    try {
      const imagePath = req.file.path;
      const formData = new FormData();
      formData.append("upload", fs.createReadStream(imagePath));
      formData.append("regions", "us-ca"); // Customize according to your needs
  
      const response = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
        method: "POST",
        headers: {
          Authorization: "Token a0cfbcf793ba3d11ae5eeb008c7f75f92bb0d813", // Use your API token
        },
        body: formData,
      });
  
      const data = await response.json();
      fs.unlinkSync(imagePath); // Clean up the uploaded file
      res.json(data); // Send the recognition results back to the frontend
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Server error");
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
