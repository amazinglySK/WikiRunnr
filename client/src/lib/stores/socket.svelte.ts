import { get, writable } from 'svelte/store'
import {
  gameInfo,
  resetDefaultState,
  soloGame,
  start,
  target,
  isLeader,
  toastRef,
} from './gameState.svelte'
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
    socket.set(newSocket)
  })

  newSocket.on('disconnect', () => {
    if (newSocket.active) {
      console.log('Temporary reconnection: trying to reconnect')
    } else {
      console.log('Disconnected from the server')
      socket.set(null)
      resetDefaultState()
    }
  })

  newSocket.on('update_game', (game) => {
    gameInfo?.set(game)
  })

  newSocket.on('start', (pages: PageContent[]) => {
    start.set(pages[0])
    target.set(pages[1])
    if (get(soloGame)) {
      goto('/game/solo')
    } else {
      goto('/game/')
    }
  })

  newSocket.on('finisher', (username: string) => {
    get(toastRef)?.addToast(`${username} finished the game`, 'success')
  })

  newSocket.on('player_leave', (username: string) => {
    get(toastRef)?.addToast(`${username} left the room`, 'error')
  })

  newSocket.on('player_join', (username: string) => {
    get(toastRef)?.addToast(`${username} joined the game`, 'success')
  })

  newSocket.on('new_leader', () => {
    get(toastRef)?.addToast(`You are the new leader`, 'success')
    isLeader.set(true)
  })

  newSocket.on('you_were_kicked', () => {
    get(toastRef)?.addToast('You were removed from the game', 'error')
    resetDefaultState()
    goto('/')
  })

  newSocket.on('end_game', () => {
    resetDefaultState()
    goto('/')
  })
}
