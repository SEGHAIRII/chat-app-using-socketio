import express from "express";
import {Server}  from "socket.io";
import http from "http";
import bodyParser from "body-parser";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const exp = express();
exp.use(express.json());
exp.use(bodyParser.json({ limit: "30mb", extended: true }));
exp.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
exp.use(cors({
    origin:['http://localhost:3000', 'http://192.168.56.1:3000']
}))

exp.get("/chat", async(req, res) =>{
    res.sendFile(__dirname + "/client.html");
})
exp.get("/", (req, res)=>{
    res.json({message: "everything is okey"});
})
const app = http.createServer(exp);
const io = new Server(app, {
    cors:{ origin: "http://localhost:3000"}
});
const chatio = io.of("/chat");
const PORT = 3000;

chatio.on("connection", (socket) => {
    console.log(socket.id);


    socket.on("disconnect", () => {
        console.log(`the socket with id ${socket.id} has disconnected`);
    })


    socket.on("chat message", (msg) =>{
        socket.broadcast.emit("chat message", msg);
        console.log(socket.data.name);
    })

    socket.on("typing", () => {
        socket.broadcast.emit("typing", socket.id);
    })
});

app.listen(PORT, ()=>
    console.log(`started listening on port ${PORT}`));