import { io } from 'socket.io-client'
import { start, target } from '$lib/stores/socket.svelte'
import { getRandomArticleTitles, getTitleFromId } from '$lib/fetchPage'

export const startSoloGame = async (start_id?: number, end_id?: number) => {
  if (start_id && end_id) {
    const [start_page, end_page] = await getTitleFromId(start_id, end_id)
    start.set(start_page)
    target.set(end_page)
  } else {
    const [start_page, end_page] = await getRandomArticleTitles(2)
    start.set(start_page)
    target.set(end_page)
    console.log('Solo game started with titles:', start_page, end_page)
  }
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
