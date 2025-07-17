import { derived, writable } from 'svelte/store'
import type { PageContent } from '$lib/fetchPage'
import Toast from '$lib/components/Toast.svelte'

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
export const soloGame = writable(true)
export const start = writable<PageContent>()
export const target = writable<PageContent>()
export const gameInfo = writable<GameInfo | null>()
export const inGame = derived([gameInfo, username], ([$g, $u]) => {
  if (!$g) {
    return false
  }
  return $g.players.findIndex((p: UserInfo) => p.username == $u) !== -1
})
export const gameCode = derived(gameInfo, ($g) => $g?.code)
export const toastRef = writable<Toast>()
