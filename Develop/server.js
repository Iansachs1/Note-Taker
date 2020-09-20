const { response } = require("express");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 8080;

const scriptPath = __dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


function readFromDB (response) {
    const filePath = path.join(scriptPath, "db", "db.json");
    fs.readFile(filePath, { encoding: "utf8" }, function (error, fileContent) {
        const fileContentJson = JSON.parse(fileContent);
        return response.json(fileContentJson);
    });
}





app.get('/', function (request, response) {
    const filePath = path.join(scriptPath, "public", "index.html");
    response.sendFile(filePath, "index.html");
});

app.get('/notes', function (request, response) {
    const filePath = path.join(scriptPath, "public", "notes.html");
    response.sendFile(filePath, "notes.html");
});

app.get('/notes/api', function (request, response) {
    readFromDB(response);
});



app.listen(PORT, function() {
    console.log('listening on port ' + PORT);
});