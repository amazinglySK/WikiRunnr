import { writable } from 'svelte/store'

export const start = writable({
  page_src: '',
  title: '',
  enc_title: '',
})

export const target = writable({
  page_src: '',
  title: '',
  enc_title: '',
})
