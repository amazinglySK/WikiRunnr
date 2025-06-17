import { writable } from 'svelte/store'
import type { PageContent } from '$lib/fetchPage'

type UserInfo = {
  username: string
  id: string
}

type Leadeboard = {
  name: string
  socket_id: string
  time: number
}[]

interface GameInfo {
  code: string
  leader_id: string
  players: UserInfo[]
  lb: Leadeboard
  started: boolean
}

export const username = writable('')
export const isLeader = writable(false)
export const start = writable<PageContent>()
export const target = writable<PageContent>()
export const gameCode = writable('')
export const gameInfo = writable<GameInfo>()
