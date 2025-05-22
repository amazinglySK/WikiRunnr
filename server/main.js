import { Server } from "socket.io";
import express from "express";
import cors from "cors"
import http from "http";
import fetchWiki from "./fetchPage.js";

const PORT = 3000;

const app = express();

app.get("/wiki{/*path}", async (req, res) => {
	const url = req.originalUrl;
	const page_result = await fetchWiki(url);
	const html_response = page_result.text["*"];
	res.setHeader('Content-Type', 'text/html');
	res.send(html_response);
});

app.use(cors({origin: "*"}));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {origin: "*"},
    cleanupEmptyChildNamespaces: true,
});


io.on("connection", (socket) => {
    console.log(socket.id + " joined the io");

    socket.on('count+', (data) => {
        console.log(`${socket.id} invoked the count+. Data ${data}`);
    });

	socket.on('get-page', async (link) => {
		try {
			const page_result = await fetchWiki(link);
			socket.emit("page-result", page_result.text["*"]);
		} catch(err) {
			console.error("FETCH ERROR:", err);
		}
	});

    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected from the server");
    });
})


httpServer.listen(PORT, () => { 
	console.log(`Server listening on http://localhost:${PORT}`);
});

