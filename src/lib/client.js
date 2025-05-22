import { io } from "socket.io-client";
import { frameData } from "./stores.js";

const URL = "http://localhost:3000"

export const socket = io(URL)

socket.on("connect", () => {
    console.log("Connected to the server");
})

socket.on("page-result", (data) => {
	frameData.set(data);	
})

socket.on("disconnect", () => {
    console.log("Disconnected from the server");
})

