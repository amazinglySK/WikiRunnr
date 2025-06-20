<script lang="ts">
  import { onDestroy } from 'svelte'

  let seconds = $state(0)
  let isRunning = $state(false)
  let intervalId = null

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  export const start = () => {
    if (!isRunning) {
      isRunning = true
      intervalId = setInterval(() => {
        seconds++
      }, 1000)
    }
  }

  export const stop = () => {
    if (isRunning) {
      isRunning = false
      if (intervalId) clearInterval(intervalId)
      intervalId = null
    }
  }

  export const reset = () => {
    stop()
    seconds = 0
  }

  export const getTime = () => {
    return formatTime(seconds)
  }

  export const getSeconds = () => {
    return seconds
  }

  onDestroy(() => {
    reset()
  })
</script>

<div class="clock flex items-center gap-2">
  <span class="material-symbols-outlined"> schedule </span>
  <span class="text-lg">{formatTime(seconds)}</span>
</div>
