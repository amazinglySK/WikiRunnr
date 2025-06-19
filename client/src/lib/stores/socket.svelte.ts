import { writable } from 'svelte/store'
import { gameInfo, start, target } from './gameState.svelte'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { PageContent } from '$lib/fetchPage'
import { goto } from '$app/navigation'

export const socket = writable<Socket | null>(null)

export function initSocket(): void {
  const URL = 'http://localhost:3000'

  const newSocket = io(URL, {
    autoConnect: false,
    withCredentials: true,
  })

  newSocket.on('connect', () => {
    if (newSocket.recovered) {
      console.log('Restored connection to server')
    } else {
      console.log('Connected to the server')
    }
  })

  newSocket.on('disconnect', () => {
    if (newSocket.active) {
      console.log('Temporary reconnection: trying to reconnect')
    } else {
      console.log('Disconnected from the server')
    }
  })

  newSocket.on('update_game', (game) => {
    gameInfo?.set(game)
  })

  newSocket.on('start', (pages: PageContent[]) => {
    console.log(pages[0], pages[1])
    start.set(pages[0])
    target.set(pages[1])
    console.log('Starting the game')
    goto('/app/game')
  })
  socket.set(newSocket)
  newSocket.connect()
}
