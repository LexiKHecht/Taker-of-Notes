const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const uniqid = require("uniqid");

let newNote = require("./Develop/db/db.json");

const PORT = 8000;
// handles parsing data
app.use(express.json());
// set up express to handle the static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./Develop/public"));

// default home route
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);

// notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// route for retrieving created notes from db file
app.get("/api/notes", (req, res) => {
  let notes = fs.readFileSync(`./Develop/db/db.json`);
  res.json(JSON.parse(notes));
});

// route for creating notes
app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received!`);

  // Destructuring
  const { title, text } = req.body;

  // If parameters are met
  if (title && text) {
    const newNote = {
      title,
      text,
      // uniqid used to give random id
      id: uniqid(),
    };

    let notes = fs.readFileSync(`./Develop/db/db.json`);
    let parsedNotes = JSON.parse(notes);
    parsedNotes.push(newNote);

    // Write the string to a file
    fs.writeFile(`./Develop/db/db.json`, JSON.stringify(parsedNotes), (err) =>
      err
        ? console.error(err)
        : console.log(`${newNote.title} note has been written to file`)
    );

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

// rout for deleting notes by id
app.delete("/api/notes/:id", async (req, res) => {
  let notes = fs.readFileSync(`./Develop/db/db.json`);
  let parsedNotes = JSON.parse(notes);
  let updatedNotes = parsedNotes.filter((note) => note.id !== req.params.id);

  // Write the string to a file
  fs.writeFile(`./Develop/db/db.json`, JSON.stringify(updatedNotes), (err) =>
    err ? res.json(err) : res.json(updatedNotes)
  );
});
    
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);