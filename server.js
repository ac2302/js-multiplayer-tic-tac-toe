const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
app.use(express.static("public"));

server = http.createServer(app);

const io = socketio(server);

// globals
const waiting = [];

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
	console.log(`server live on port ${PORT}`);
});

app.get("/game", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "game.html"));
});

io.on("connection", (socket) => {
	socket.on("introduction", (nick) => {
		console.log(`${socket.id} has joined as ${nick}`);

		// adding socket to queue
		addToQueue({ socket, nick });

		// disconnect
		socket.on("disconnect", () => {
			console.log(`${nick} has left`);
		});
	});
});

// add socket to queue
function addToQueue(player) {
	if (waiting.length === 0) {
		waiting.push(player);
	} else {
		startGame(player, waiting[0]);
		waiting.pop();
	}
}

// the game
function startGame(p1, p2) {
	s1 = p1.socket;
	s2 = p2.socket;

	// send confirmation
	s1.emit("join", { opp: p2.nick });
	s2.emit("join", { opp: p1.nick });

	// disconnect
	s1.on("disconnect", () => {
		s2.emit("print", `${p1.nick} has left`);
	});
	s2.on("disconnect", () => {
		s1.emit("print", `${p2.nick} has left`);
	});
}
