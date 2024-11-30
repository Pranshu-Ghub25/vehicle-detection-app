const express = require('express');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require("cors");
const bodyParser = require('body-parser');

require('dotenv').config();


// Setup
const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());

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
      setTimeout(() => {
        fs.unlinkSync(imagePath); // Clean up the uploaded file after 2 minutes
        console.log(`Deleted file: ${imagePath}`);
      }, 2 * 60 * 1000)// Clean up the uploaded file
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Server error");
    }
  });


  //sms auth

 
// API endpoint to handle phone verification
app.post('/api/verify-phone', (req, res) => {
  console.log("hello");
  const { user_json_url } = req.body;
  console.log(user_json_url);

  if (!user_json_url) {
    return res.status(400).json({ error: 'user_json_url is required' });
  }

  // Fetch the user data from the JSON URL
  https.get(user_json_url, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data);

        const {
          user_country_code,
          user_phone_number,
          user_first_name,
          user_last_name,
        } = jsonData;

        console.log('User Info:', jsonData);

        res.json({
          user_country_code,
          user_phone_number,
          user_first_name,
          user_last_name,
        });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing JSON response' });
      }
    });
  }).on('error', (err) => {
    console.error('Error fetching JSON:', err.message);
    res.status(500).json({ error: 'Error fetching JSON data' });
  });
});
console.log(process.env.PLATE_RECOGNIZER_API_TOKEN+"   "+ process.env.PLATE_RECOGNIZER_API_TOKEN)
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
