const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

//url encoded
app.use(bodyParser.urlencoded({ extended: true }));
//json
app.use(bodyParser.json());
// Middleware
app.use(bodyParser.json());
app.use(cors());
//set view engine ejs
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  res.render("index", { responseData: {} });
});
// Route for GET method
app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

// Route for POST method
app.post("/bfhl", (req, res) => {
  let { data, file_b64, filter } = req.body;

  // Parse the 'data' string into a JSON array
  try {
    data = JSON.parse(data);
  } catch (error) {
    return res.render("index", {
      responseData: null,
      error: "Invalid JSON format for data field.",
    });
  }

  let numbers = [];
  let alphabets = [];
  let highestLowercaseAlphabet = [];
  let isFileValid = false;
  let fileMimeType = "";
  let fileSizeKB = 0;

  // Separate numbers and alphabets
  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (typeof item === "string") {
      alphabets.push(item);
    }
  });

  // Find highest lowercase alphabet
  const lowercaseAlphabets = alphabets.filter(
    (char) => char >= "a" && char <= "z"
  );
  if (lowercaseAlphabets.length > 0) {
    highestLowercaseAlphabet = [lowercaseAlphabets.sort().pop()];
  }

  // Handle file if present
  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileSizeKB = (buffer.length / 1024).toFixed(2);
      fileMimeType = "image/png"; // Assume the MIME type, modify as needed
      isFileValid = true;
    } catch (error) {
      isFileValid = false;
    }
  }

  // Prepare response object
  let response = {
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers: numbers,
    alphabets: alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet,
    file_valid: isFileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  };

  // Filter the response based on the dropdown selection
  if (filter === "numbers") {
    response = { numbers: numbers };
  } else if (filter === "alphabets") {
    response = { alphabets: alphabets };
  } else if (filter === "highest_lowercase_alphabet") {
    response = { highest_lowercase_alphabet: highestLowercaseAlphabet };
  } else if (filter === "file_valid") {
    response = { file_valid: isFileValid };
  } else if (filter === "file_mime_type") {
    response = { file_mime_type: fileMimeType };
  } else if (filter === "file_size_kb") {
    response = { file_size_kb: fileSizeKB };
  }

  res.json(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
