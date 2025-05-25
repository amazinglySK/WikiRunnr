import { io } from 'socket.io-client'
import { start, target } from '../stores/socket.js'

const URL = 'http://localhost:3000'

export const socket = io(URL)

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('game-info', (info) => {
  start.set(info.start)
  target.set(info.target)
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})
