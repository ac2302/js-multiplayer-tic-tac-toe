const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
app.use(express.static("public"));

server = http.createServer(app);

const io = socketio(server);

// globals
let waiting = "";

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
			if (waiting.socket === socket) {
				waiting = "";
				console.log(`removed ${nick} from waiting`);
			}
		});
	});
});

// add socket to queue
function addToQueue(player) {
	if (waiting === "") {
		waiting = player;
		console.log(`set ${player.nick} to waiting`);
	} else {
		console.log(`matched ${player.nick} and ${waiting.nick}`);
		startGame(player, waiting);
		waiting = "";
	}
}

// the game
function startGame(p1, p2) {
	s1 = p1.socket;
	s2 = p2.socket;

	let symbols = ["X", "O"];
	if (Math.random() > 0.5) {
		symbols = ["O", "X"];
	}

	// send confirmation
	s1.emit("join", { opp: p2.nick, p1s: symbols[0], p2s: symbols[1] });
	s2.emit("join", { opp: p1.nick, p1s: symbols[1], p2s: symbols[0] });

	// moves
	s1.on("moved", (move) => {
		s2.emit("move", move);
	});
	s2.on("moved", (move) => {
		s1.emit("move", move);
	});

	// disconnect
	s1.on("disconnect", () => {
		s2.emit("abandon", `${p1.nick} has left`);
	});
	s2.on("disconnect", () => {
		s1.emit("abandon", `${p2.nick} has left`);
	});
}
