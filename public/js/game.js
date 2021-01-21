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

const p1 = "X";
const p2 = "O";
let turn = "p1";

// click event handler
for (let i = 0; i < cells.length; i++) {
	cells[i].addEventListener("click", (e) => {
		if (e.target.innerText == "" && turn === "p1") {
			e.target.innerText = p1;
			console.log(getWinner());
		}
	});
}

// checking for wins
function getWinner() {
	const p1Status = hasWon(p1);
	const p2Status = hasWon(p2);
	if (p1Status.won) {
		highlight(p1Status.pattern);
		return p1;
	} else if (p2Status.won) {
		highlight(p2Status.pattern);
		return p2;
	}
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
function highlight(pattern) {}
