// all require statemente
const express = require("express");
const fs = require("fs");
const path = require("path");

// references the json file containing my notes api info
var dbNotes = require("./db/db.json");

// connection setup qtuff for express
const app = express();
const PORT = process.env.PORT || 8080;

// variable used to get the path to this page
const scriptPath = __dirname;

// middleware for express including the static folder which took me forever to find i was missing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Allows static files in public folder to be accessed

//=========================================================================================
// functions to affect the json database
//=========================================================================================

// reads all contets from the json database and returns it to the page
function readFromDB (response) {
    const filePath = path.join(scriptPath, "db", "./db.json");
    fs.readFile(filePath, { encoding: "utf8" }, function (error, fileContent) {
        const fileContentJson = JSON.parse(fileContent);
        response.json(fileContentJson);
    });
}


// takes in a new note and pushes it to the json database
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

// finds the array index of the not from the delete request and removes it from the array
function deleteFromDB (deletedNote) {
    const filePath = path.join(scriptPath, "db", "db.json");
    dbNotes.splice((deletedNote - 1), 1);
    
    generateID(dbNotes);
    var updatedNotes = JSON.stringify(dbNotes);
    fs.writeFile(filePath, updatedNotes, function (error, file) {
        if (error) throw error;
    });
}

// creates an id for all notes in the database
function generateID(dbNotes) {
    for (let i = 0; i < dbNotes.length; i++) {
        dbNotes[i].id = (i + 1);
    }
}



//=========================================================================================
// routes and listeners
//=========================================================================================


// displays the root route
app.get('/', function (request, response) {
    const filePath = path.join(scriptPath, "public", "./index.html");
    response.sendFile(filePath, "index.html");
});

// displays the /notes route
app.get('/notes', function (request, response) {
    const filePath = path.join(scriptPath, "public", "./notes.html");
    response.sendFile(filePath, "notes.html");
});

// displays the /api/notes route
app.get('/api/notes', function (request, response) {
    readFromDB(response);
});

app.get("/api/notes/:id", function (request, response) {
    var chosen = request.params.id;
  
    for (var i = 0; i < dbNotes.length; i++) {
      if (chosen === dbNotes[i].id) {
        return response.json(dbNotes[i + 1]);
      }
    }
  
    return response.json(false);
});

// writes the note from the post request to the database
app.post("/api/notes", function (request, response) {
    let newNote = request.body;
    response.send(writeToDB(newNote));
});

// calls the deletefromDB function and passes the id of the note from the delete request to the function
app.delete('/api/notes/:id', function (request, response) {
    var deletedNote = request.params.id
    deleteFromDB(deletedNote);
    response.status(204);
});

// bog standard listener. jedi business, go back to your drinks
app.listen(PORT, function() {
    console.log('listening on port ' + PORT);
});