const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const { nanoid } = require("nanoid");
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for feedback page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  //allnotes is the JSON configured back
  let allnotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"))
  );
  //pushes the notes to the browser
  res.json(allnotes);
});

app.post("/api/notes", (req, res) => {
  //allnotes is the JSON configured back
  let allnotes = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"))
  );
  //pushes entire object written in new note
  console.log(nanoid());
  const newNote = {
    ...req.body,
    id: nanoid(),
  };
  allnotes.push(newNote);
  //rewrites the file with given new information
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(allnotes)
  );
  //pushes the notes to the browser
  res.json(allnotes);
});
app.delete("/api/notes/:id", async (req, res) => {
  const notesData = JSON.parse(
    fs.readFileSync(path.join(__dirname, "/db/db.json"))
  );
  const filterOut = notesData.filter((note) => note.id !== req.params.id);
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(filterOut)
  );
  res.status(200).send("Note deleted succesfully");
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
