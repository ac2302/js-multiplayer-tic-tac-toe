const socket = io();

// get nick from url
const { nick } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

const cells = document.querySelectorAll(".cell");

const winningCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];
const highlightColor = "#ff0000";

let players = [];
let turn = "";

// click event handler
for (let i = 0; i < cells.length; i++) {
	cells[i].addEventListener("click", (e) => {
		if (e.target.innerText == "" && turn === players[0]) {
			e.target.innerText = players[0];
			// do win loss stuff
			handleWins();
			// send move to server
			socket.emit("moved", e.target.id);
			// change move
			move = players[1];
			document.getElementById("your-move").style.display = "none";
		}
	});
}

// handling wins and losses
function handleWins() {
	const winner = getWinner();
	if (winner === "nobody") {
		// check for draw
		let blanks = 0;
		for (let i = 0; i < cells.length; i++) {
			if (cells[i].innerText == "") {
				blanks++;
			}
		}
		if (blanks === 0) {
			endgame("draw");
		}
	} else {
		endgame(`you have ${winner === players[0] ? "won" : "lost"}`);
	}
}

function getWinner() {
	const p0Status = hasWon(players[0]);
	const p1Status = hasWon(players[1]);
	if (p0Status.won) {
		highlight(p0Status.pattern);
		return players[0];
	} else if (p1Status.won) {
		highlight(p1Status.pattern);
		return players[1];
	}
	return "nobody";
}

function hasWon(player) {
	for (let i = 0; i < winningCombos.length; i++) {
		let matches = 0;
		for (let j = 0; j < cells.length; j++) {
			if (cells[j].innerText === player) {
				if (winningCombos[i].includes(j)) {
					matches++;
				}
			}
		}
		if (matches === 3) {
			return { won: true, pattern: i };
		}
	}

	return { won: false };
}

// highlight winning combo
function highlight(pattern) {
	pattern = winningCombos[pattern];
	for (let i = 0; i < pattern.length; i++) {
		cells[pattern[i]].style.color = highlightColor;
		// console.log(cells[pattern[i]]);
	}
}

// display the table on match
function displayTable() {
	document.getElementById("grid-container").style.display = "block";
	document.getElementById("opp-info").style.display = "block";
	document.getElementById("wait-message").style.display = "none";
}

// display opponent nickname
function setOppNick(nick) {
	document.getElementById("opp-nick").innerText = nick;
}

// display endgame message
function endgame(message) {
	turn = "";
	document.getElementById("endgame").style.display = "block";
	document.getElementById("game-result").innerText = message;
	document.getElementById("your-move").style.display = "none";
}

// ======================= socket stuff ==========================
// debug
socket.on("print", (msg) => {
	console.log("debug " + msg);
});

// introduction
socket.emit("introduction", nick);

// game starts
socket.on("join", ({ opp, p1s, p2s }) => {
	displayTable();
	setOppNick(opp);
	players.push(p1s);
	players.push(p2s);
	if (p1s == "X") {
		turn = players[0];
		document.getElementById("your-move").style.display = "block";
	} else {
		turn = players[1];
		document.getElementById("your-move").style.display = "none";
	}

	// opponent moves
	socket.on("move", (move) => {
		turn = players[0];
		document.getElementById("your-move").style.display = "block";
		cells[move].innerText = players[1];
		handleWins();
	});

	// opponent abandons
	socket.on("abandon", (message) => {
		endgame(message);
	});
});

// event handler for play again
document.getElementById("play-again").addEventListener("click", () => {
	location.reload();
});
