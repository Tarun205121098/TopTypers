const express = require("express");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/store", (req, res) => {
  const clientName = req.body.name;
  const clientMarks = req.body.marks;

  // Read existing data from JSON file
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    // Add the new client information (name and marks)
    jsonData.push({ name: clientName, marks: clientMarks });

    // Sort the data by marks in descending order
    jsonData.sort((a, b) => b.marks - a.marks);

    // Keep only the top 5 elements
    jsonData = jsonData.slice(0, 5);

    // Write updated data back to the JSON file
    fs.writeFile("data.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      }

      res.sendStatus(200);
    });
  });
});

//get data
app.get("/data", (req, res) => {
  // Read data from JSON file and send it as JSON response
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }

    let jsonData = [];
    if (data) {
      jsonData = JSON.parse(data);
    }

    res.json(jsonData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
