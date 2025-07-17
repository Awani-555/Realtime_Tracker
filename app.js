const express = require('express');
const app = express();
const http = require("http");
const socketio= require("socket.io");
const server = http.createServer(app);
const path=require("path");

app.set("view engine","ejs");
app.set(express.static(path.join(__dirname, "public")));

app.get("/", function (req,res) {
    res.send("hey");
});
server.listen(3000);
