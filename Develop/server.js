const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");

var dbNotes = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 8080;

const scriptPath = __dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Allows static files in public folder to be accessed

function readFromDB (response) {
    const filePath = path.join(scriptPath, "db", "./db.json");
    fs.readFile(filePath, { encoding: "utf8" }, function (error, fileContent) {
        const fileContentJson = JSON.parse(fileContent);
        response.json(fileContentJson);
    });
}

function writeToDB (newNote) {
    const filePath = path.join(scriptPath, "db", "db.json");

    dbNotes.push(newNote);
    generateID(dbNotes);
    var updatedNotes = JSON.stringify(dbNotes);
    fs.writeFile(filePath, updatedNotes, function (error, file) {
        if (error) throw error;
        console.log("working");
    });
}

function deleteFromDB (deletedNote) {
    const filePath = path.join(scriptPath, "db", "db.json");
    dbNotes.splice((deletedNote - 1), 1);
    
    generateID(dbNotes);
    var updatedNotes = JSON.stringify(dbNotes);
    fs.writeFile(filePath, updatedNotes, function (error, file) {
        if (error) throw error;
    });
}

function generateID(dbNotes) {
    for (let i = 0; i < dbNotes.length; i++) {
        dbNotes[i].id = (i + 1);
    }
}


app.get('/', function (request, response) {
    const filePath = path.join(scriptPath, "public", "./index.html");
    response.sendFile(filePath, "index.html");
});

app.get('/notes', function (request, response) {
    const filePath = path.join(scriptPath, "public", "./notes.html");
    response.sendFile(filePath, "notes.html");
});

app.get('/api/notes', function (request, response) {
    readFromDB(response);
});

app.get("/api/notes/:id", function (request, response) {
    var chosen = request.params.id;
  
    for (var i = 0; i < dbNotes.length; i++) {
      if (chosen === dbNotes[i].id) {
        return response.json(dbNotes[i +1]);
      }
    }
  
    return response.json(false);
});

app.post("/api/notes", function (request, response) {
    let newNote = request.body;
    response.send(writeToDB(newNote));
});

app.delete('/api/notes/:id', function (request, response) {
    var deletedNote = request.params.id
    deleteFromDB(deletedNote);
    response.status(204);
});


app.listen(PORT, function() {
    console.log('listening on port ' + PORT);
});