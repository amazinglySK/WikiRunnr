<script>
  import { onDestroy } from 'svelte'

  let seconds = $state(0)
  let isRunning = $state(false)
  let intervalId = null

  const formatTime = (totalSeconds) => {
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

  onDestroy(() => {
    reset()
  })
</script>

<div class="clock flex gap-2 items-center">
  <span class="material-symbols-outlined"> schedule </span>
  <span class="text-lg">{formatTime(seconds)}</span>
</div>
