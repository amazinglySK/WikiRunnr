import { get, writable } from 'svelte/store'
import { gameInfo, start, target } from './gameState.svelte'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { PageContent } from '$lib/fetchPage'
import { goto } from '$app/navigation'
import { PUBLIC_MODE } from '$env/static/public'

export const socket = writable<Socket | null>(null)

export function initSocket(): void {
  if (PUBLIC_MODE !== 'MULTI') {
    return
  }

  if (get(socket)?.connected) {
    console.log('Already connected')
    return
  } else {
    console.log('Creating a new socket')
  }

  const URL = 'http://localhost:3000'

  const newSocket = io(URL, {
    autoConnect: true,
    withCredentials: true,
    reconnectionAttempts: Infinity, // Keep trying to reconnect
    reconnectionDelay: 1000, // Start with 1 second delay
    reconnectionDelayMax: 5000, // Max 5 seconds delay
    timeout: 20000, // Connection timeout
  })

  newSocket.on('connect', () => {
    console.log('Connected to the server')
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
}
