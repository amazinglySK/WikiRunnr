<script>
  import { onDestroy, onMount } from 'svelte'
  import { socket } from './lib/client'
  import { start, target } from './stores/socket.js'
  import Clock from './lib/components/Clock.svelte'

  let started = $state(false)
  let currentLocation = $state('')
  let clockRef

  onMount(async () => {
    socket.connect()
    socket.emit('get-page', '')
  })

  onDestroy(() => {
    if (!socket) {
      return
    }

    socket.disconnect()
    socket.off('connect')
    socket.off('disconnect')
  })

  const startGame = async () => {
    socket.emit('start')
    started = true
    clockRef.start()
  }

  const handleFrameLoad = async (e) => {
    try {
      const doc = e.target.contentWindow.document || e.target.contentDocument
      currentLocation = doc.location.pathname
      const decoded_url = decodeURIComponent(doc.location.href)
        .split('/')
        .at(-1)
      console.log(decoded_url, $target.page_src)
      if ($target.page_src && decoded_url === $target.page_src) {
        alert('Eureka!')
        clockRef.stop()
      }
    } catch (e) {
      console.log('Oops something went wrong')
      console.error(e)
    }
  }
</script>

<main>
  <h1 class="text-4xl font-bold text-center">WikiRunnr</h1>
  <div class="mx-auto max-w-3/4 py-2 flex justify-between items-center">
    <button
      class={`btn btn-secondary btn-md ${started && 'btn-disabled'}`}
      onclick={startGame}
    >
      Start</button
    >
    {#if started}
      <div class="flex gap-2 items-center text-md">
        <span class="material-symbols-outlined"> flag </span>
        <span
          ><a
            class="link"
            target="_blank"
            href={`https://en.wikipedia.org/wiki/${$target.enc_title}`}
            >{$target.title}</a
          ></span
        >
      </div>
    {/if}
    <Clock bind:this={clockRef}></Clock>
  </div>
  <div class="mockup-browser border-base-300 border max-w-3/4 mx-auto">
    <div class="mockup-browser-toolbar">
      <div class="input">
        {currentLocation}
      </div>
    </div>
    <iframe
      onload={handleFrameLoad}
      src={$start.enc_title ? `/wiki/${$start.enc_title}` : '/wiki/Wikipedia'}
      title="game window"
      class="w-full h-screen bg-white"
      frameborder="0"
    >
    </iframe>
  </div>
</main>
