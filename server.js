const express = require("express");
const path = require("path");
const app = express();
const fs = require("fs");
const uniqid = require("uniqid");

let newNote = require("./Develop/db/db.json");

const PORT = 3002;
// handles parsing data
app.use(express.json());
// set up express to handle the static files
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./Develop/public"));

// default home route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./Develop/public/index.html"))
);

// notes route
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  let notes = fs.readFileSync(`./Develop/db/db.json`);
  res.json(JSON.parse(notes));
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received!`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: uniqid(),
    };

    let notes = fs.readFileSync(`./Develop/db/db.json`);
    let parsedNotes = JSON.parse(notes);
    parsedNotes.push(newNote);

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

app.delete("/api/notes/:id", async (req, res) => {
  let notes = fs.readFileSync(`./Develop/db/db.json`);
  let parsedNotes = JSON.parse(notes);
  let updatedNotes = parsedNotes.filter((note) => note.id !== req.params.id);

  fs.writeFile(`./Develop/db/db.json`, JSON.stringify(updatedNotes), (err) =>
    err ? res.json(err) : res.json(updatedNotes)
  );
});
    
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);