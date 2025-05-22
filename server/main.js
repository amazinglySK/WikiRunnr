import { Server } from "socket.io";
import axios from "axios";

const PORT = 3000;
const server = new Server(PORT, {
    cors: {origin: "*"},
    cleanupEmptyChildNamespaces: true,
})

const MEDIAWIKI = "https://en.wikipedia.org/w/api.php"; 

server.on("connection", (socket) => {
    console.log(socket.id + " joined the server");

    socket.on('count+', (data) => {
        console.log(`${socket.id} invoked the count+. Data ${data}`)
    })

	socket.on('get-page', async (link) => {
		try {
			let search_term = link.split("\/").at(-1);
			console.log(link, search_term);
			let page_result = await axios.get(MEDIAWIKI, {
				params: {
					action: 'parse',
					page: search_term,
					format:'json',
					origin: '*',
				}
			});
			
			socket.emit("page-result", page_result.data.parse.text['*']);
		} catch(err) {
			console.error(err);
		}
	});

    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected from the server");
    })
})

console.log(`Server listening on http://localhost:${PORT}`);
