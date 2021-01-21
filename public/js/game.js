const board = ["", "", "", "", "", "", "", "", ""];
const cells = document.querySelectorAll(".cell");

const p1 = "X";
const p2 = "O";
let turn = "p1";

// click event handler
for (let i = 0; i < cells.length; i++) {
	cells[i].addEventListener("click", (e) => {
		if (e.target.innerText == "" && turn === "p1") {
			e.target.innerText = p1;
		}
	});
}

// checking for wins
