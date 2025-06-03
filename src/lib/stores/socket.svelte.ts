import { writable } from 'svelte/store'
import type { PageContent } from '$lib/fetchPage'

export const start = writable<PageContent>()
export const target = writable<PageContent>()
