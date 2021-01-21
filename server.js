const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
app.use(express.static("public"));

server = http.createServer(app);

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => {
	console.log(`server live on port ${PORT}`);
});

app.get("/game", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "game.html"));
});
