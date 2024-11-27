const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require("cors");
require('dotenv').config();

// Setup
const app = express();
const PORT = process.env.PORT || 5000;

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

const upload = multer({
  dest: path.join(__dirname, "uploads") // Ensure the 'uploads' folder exists in the project root
});

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
          Authorization: `Token ${process.env.PLATE_RECOGNIZER_API_TOKEN}`, // Use your API token
        },
        body: formData,
      });
  
      const data = await response.json();
      res.json(data); // Send the recognition results back to the frontend
  
      // Wait for 2 minutes before deleting the file
      setTimeout(() => {
        fs.unlinkSync(imagePath); // Clean up the uploaded file after 2 minutes
        console.log(`Deleted file: ${imagePath}`);
      }, 2 * 60 * 1000); // 2 minutes in milliseconds
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Server error");
    }
  });

console.log(process.env.PLATE_RECOGNIZER_API_TOKEN + "   " + process.env.PORT);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
