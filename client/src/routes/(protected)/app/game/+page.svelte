<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { startSoloGame } from '$lib/client'
  import { socket } from '$lib/stores/socket.svelte'
  import Clock from '$lib/components/Clock.svelte'
  import {
    soloGame,
    target,
    start,
    gameInfo,
  } from '$lib/stores/gameState.svelte'
  import GameEndModal from '$lib/components/GameEndModal.svelte'
  import { page } from '$app/stores'
  import Toast from '$lib/components/Toast.svelte'

  let started = $state(false)
  let currentLocation = $state('')
  let final_time = $state('')
  let gameEndModal: GameEndModal | undefined = $state<GameEndModal>()
  let clockRef: Clock | undefined = $state<Clock>()
  let iframeRef: HTMLIFrameElement
  let toastRef: Toast | undefined = $state<Toast>()

  onMount(async () => {
    const params = $page.url.searchParams
    let start_id = parseInt(params.get('start') ?? '')
    let end_id = parseInt(params.get('end') ?? '')

    $socket?.on('finisher', (username: string) => {
      toastRef?.show(`${username} finished the game`)
      console.log(`${username} finished the game`)
    })

    if (start_id && end_id) {
      await startGame(start_id, end_id)
    }

    if (!$soloGame) await startGame()
  })

  onDestroy(() => {
    $socket?.disconnect()
  })

  const startGame = async (start_id?: number, end_id?: number) => {
    if ($soloGame) await startSoloGame(start_id, end_id)
    started = true
    clockRef?.reset()
    clockRef?.start()
  }

  const restart = async () => {
    clockRef?.reset()
    if ($soloGame) await startSoloGame()
    started = true
    clockRef?.start()
  }

  const finishGame = () => {
    const doc = iframeRef?.contentWindow?.document || iframeRef?.contentDocument
    if (doc) doc.location.href = `/wiki/${$target.enc_title}`
  }

  const handleFrameLoad = async () => {
    try {
      const doc =
        iframeRef?.contentWindow?.document || iframeRef?.contentDocument
      currentLocation = doc?.location.pathname ?? ''
      const decoded_url = decodeURIComponent(doc?.location.href ?? '')
        .split('/')
        .at(-1)
      // Win condition
      if ($target && $target.page_src && decoded_url === $target.page_src) {
        started = false
        final_time = clockRef?.getTime() ?? ''
        if (!$soloGame)
          $socket?.emit('finish', $gameInfo.code, clockRef?.getSeconds())
        gameEndModal?.show()
        clockRef?.stop()
      }
    } catch (e) {
      console.log('Oops something went wrong')
      console.error(e)
    }
  }
</script>

<div class="flex w-full items-center justify-between py-2">
  {#if $soloGame}
    <button
      class={`btn btn-secondary btn-md ${started && 'btn-disabled'}`}
      onclick={() => {
        startGame()
      }}
    >
      Start</button
    >
  {/if}
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
<Toast bind:this={toastRef} />
{#if import.meta.env.DEV}
  <div id="dev-tools" class="mx-auto my-4 text-center">
    <button class="btn btn-soft btn-primary" onclick={gameEndModal?.show}
      >Test modal</button
    >
    <button class="btn btn-soft btn-primary" onclick={finishGame}
      >Finish game</button
    >

    <button
      class="btn btn-soft btn-primary"
      onclick={() => {
        toastRef?.show('This is a test')
      }}>Test toast</button
    >
  </div>
{/if}
