import { io } from 'socket.io-client'
import { start, target } from '$lib/stores/socket.svelte'
import { getRandomArticleTitles } from '$lib/fetchPage'

export const startSoloGame = async () => {
  const titles = await getRandomArticleTitles(2)
  start.set(titles[0])
  target.set(titles[1])
  console.log('Solo game started with titles:', titles)
}

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

