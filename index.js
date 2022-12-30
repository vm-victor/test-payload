const { Server } = require('socket.io');
const http = require('http');
const { v4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
var readline = require('readline');


const FILE_PORT = 8080;

const assetsPath = path.join(__dirname, `./public`);
const srv = http.createServer((req, res) => {
    fs.readFile(assetsPath + req.url, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
}).listen(FILE_PORT, () => console.log(`Serve ${FILE_PORT}`));

const io = new Server(srv);

io.on('connection', (socket) => {
    console.log('a user connected');

        socket.on('connect', () => {
            console.log('connect');
        });

        socket.on('connect_error', () => {
            console.log('connect_error');
        });

        socket.on('disconnect', () => {
            console.log('disconnect');
        });

        socket.on('session_request', async (msg) => {
            console.log('session_request');
            io.emit('session_confirm', "toto", socket.id);
        });

        socket.on('session_confirm', () => {
            console.log('session_confirm');
        });

        socket.on('user_uttered', async (msg) => {
            console.log(msg);
            
            var input = [];

            var rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.prompt();

            rl.on('line', function (cmd) {

                input.push(cmd);
            });

            rl.on('close', function (cmd) {
                console.log("send reponse");
                io.emit('bot_uttered', JSON.parse(input.join('')), socket.id);
            });
        });

        socket.on('bot_uttered', () => {
            console.log('bot_uttered');
        });

        socket.on('packet', () => {
            console.log('packet');
    });
});
