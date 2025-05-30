<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { socket, startSoloGame } from '$lib/client.js'
  import { start, target } from '$lib/stores/socket.svelte'
  import Clock from '$lib/components/Clock.svelte'
  import GameEndModal from '$lib/components/GameEndModal.svelte'
  import { PUBLIC_MODE } from '$env/static/public'

  let started = $state(false)
  let currentLocation = $state('')
  let final_time = $state('')
  let gameEndModal: GameEndModal
  let clockRef: Clock
  let iframeRef: HTMLIFrameElement

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
    started = true
    clockRef.start()
  }

  const restart = async () => {
    clockRef.reset()
    await startSoloGame()
    started = true
    clockRef.start()
  }

  const finishGame = () => {
    const doc = iframeRef?.contentWindow?.document || iframeRef?.contentDocument
    if (doc) doc.location.href = `/wiki/${$target.enc_title}`
  }

  const handleFrameLoad = async (e: Event) => {
    try {
      const doc =
        iframeRef?.contentWindow?.document || iframeRef?.contentDocument
      currentLocation = doc.location.pathname
      const decoded_url = decodeURIComponent(doc.location.href)
        .split('/')
        .at(-1)
      console.log(decoded_url, $target.page_src)
      // Win condition
      if ($target.page_src && decoded_url === $target.page_src) {
        started = false
        final_time = clockRef.getTime()
        gameEndModal.show()
        clockRef.stop()
      }
    } catch (e) {
      console.log('Oops something went wrong')
      console.error(e)
    }
  }
</script>

<main class="mx-auto max-w-3/4">
  <h1 class="pt-3 text-center text-4xl font-bold">WikiRunnr</h1>
  {#if import.meta.env.DEV}
    <p class="text-center">(Debug Mode)</p>
  {/if}
  <div class="flex w-full items-center justify-between py-2">
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
  <div class="mockup-browser border-base-300 border">
    <div class="mockup-browser-toolbar">
      <div class="input">
        {currentLocation}
      </div>
    </div>
    <iframe
      onload={handleFrameLoad}
      src={started && $start.enc_title
        ? `/wiki/${$start.enc_title}`
        : '/wiki/Wikipedia'}
      bind:this={iframeRef}
      title="game window"
      class="h-screen w-full bg-white"
      frameborder="0"
    >
    </iframe>
  </div>
  <GameEndModal bind:this={gameEndModal} {restart} time={final_time} />

  {#if import.meta.env.DEV}
    <div id="dev-tools" class="mx-auto my-4 text-center">
      <button class="btn btn-soft btn-primary" onclick={gameEndModal.show}
        >Test modal</button
      >
      <button class="btn btn-soft btn-primary" onclick={finishGame}
        >Finish game</button
      >
    </div>
  {/if}
</main>
