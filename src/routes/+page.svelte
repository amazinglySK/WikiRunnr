<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { socket, startSoloGame } from '$lib/client.js'
  import { start, target } from '$lib/stores/socket.svelte'
  import Clock from '$lib/components/Clock.svelte'
  import { browser } from '$app/environment'
  import { PUBLIC_MODE } from '$env/static/public'

  let started = $state(false)
  let currentLocation = $state('')
  let clockRef: Clock

  onMount(async () => {
    if (PUBLIC_MODE == 'SOLO') {
      socket.connect()
    }
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
    await startSoloGame()
    console.log(browser)
    started = true
    clockRef.start()
  }

  const handleFrameLoad = async (e: Event) => {
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
  <h1 class="text-center text-4xl font-bold">WikiRunnr</h1>
  <div class="mx-auto flex max-w-3/4 items-center justify-between py-2">
    <button
      class={`btn btn-secondary btn-md ${started && 'btn-disabled'}`}
      onclick={startGame}
    >
      Start</button
    >
    {#if started}
      <div class="text-md flex items-center gap-2">
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
  <div class="mockup-browser border-base-300 mx-auto max-w-3/4 border">
    <div class="mockup-browser-toolbar">
      <div class="input">
        {currentLocation}
      </div>
    </div>
    <iframe
      onload={handleFrameLoad}
      src={$start.enc_title ? `/wiki/${$start.enc_title}` : '/wiki/Wikipedia'}
      title="game window"
      class="h-screen w-full bg-white"
      frameborder="0"
    >
    </iframe>
  </div>
</main>
