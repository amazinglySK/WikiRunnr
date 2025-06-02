import { writable } from 'svelte/store'

type PageContent = {
  id: number
  page_src: string
  title: string
  enc_title: string
}

export const start = writable<PageContent>()
export const target = writable<PageContent>()
