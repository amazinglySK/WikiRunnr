import { io } from 'socket.io-client'

const URL = 'http://localhost:3000'

export const socket = io(URL)

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})
