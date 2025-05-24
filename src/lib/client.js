import { io } from 'socket.io-client'
import { page_url, target } from '../stores/socket.js'

const URL = 'http://localhost:3000'

export const socket = io(URL)

socket.on('connect', () => {
  console.log('Connected to the server')
})

socket.on('game-info', (info) => {
  page_url.set(info.start)
  target.set(info.target.replace(/_/g, ' '))
})

socket.on('disconnect', () => {
  console.log('Disconnected from the server')
})
