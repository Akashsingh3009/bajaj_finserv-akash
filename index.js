const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1,
  });
});

app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  let numbers = [];
  let alphabets = [];
  let highestLowercaseAlphabet = [];
  let isFileValid = false;
  let fileMimeType = "";
  let fileSizeKB = 0;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (typeof item === "string") {
      alphabets.push(item);
    }
  });

  const lowercaseAlphabets = alphabets.filter(
    (char) => char >= "a" && char <= "z"
  );
  if (lowercaseAlphabets.length > 0) {
    highestLowercaseAlphabet = [lowercaseAlphabets.sort().pop()];
  }

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileSizeKB = (buffer.length / 1024).toFixed(2);
      fileMimeType = "image/png";
      isFileValid = true;
    } catch (error) {
      isFileValid = false;
    }
  }

  res.json({
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
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
