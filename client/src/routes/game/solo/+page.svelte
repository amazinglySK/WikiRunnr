<script lang="ts">
  import { onMount } from 'svelte'
  import { startSoloGame } from '$lib/client'
  import Clock from '$lib/components/Clock.svelte'
  import { target, start, toastRef } from '$lib/stores/gameState.svelte'
  import GameEndModal from '$lib/components/GameEndModal.svelte'
  import { page } from '$app/state'
  import DevTools from '$lib/components/DevTools.svelte'
  import GameBar from '$lib/components/GameBar.svelte'

  let started = $state(false)
  let loading = $state(false)
  let currentLocation = $state('')
  let final_time = $state('')
  let gameEndModal: GameEndModal | undefined = $state<GameEndModal>()
  let clockRef: Clock | undefined = $state<Clock>()
  let iframeRef: HTMLIFrameElement | undefined = $state<HTMLIFrameElement>()

  onMount(async () => {
    const params = page.url.searchParams
    let start_id = parseInt(params.get('start') ?? '')
    let end_id = parseInt(params.get('end') ?? '')

    if (start_id && end_id) {
      await startGame(start_id, end_id)
    } else {
      await startGame()
    }
  })

  const startGame = async (start_id?: number, end_id?: number) => {
    loading = true
    try {
      await startSoloGame(start_id, end_id)
    } finally {
      loading = false
    }
    started = true
    clockRef?.reset()
    clockRef?.start()
  }

  const restart = async () => {
    clockRef?.reset()
    loading = true
    try {
      await startSoloGame()
    } finally {
      loading = false
    }
    started = true
    clockRef?.start()
  }

  const handleFrameLoad = async () => {
    try {
      const doc =
        iframeRef?.contentWindow?.document || iframeRef?.contentDocument
      const path = doc?.location.pathname ?? ''

      // Layer 2: snap back if the player escaped the proxy
      if (started && path && !path.startsWith('/wiki/')) {
        if (iframeRef) iframeRef.src = currentLocation || `/wiki/${$start?.enc_title}`
        $toastRef?.addToast('Stay on Wikipedia!', 'error')
        return
      }

      currentLocation = path
      const decoded_url = decodeURIComponent(doc?.location.href ?? '')
        .split('/')
        .at(-1)
      // Win condition
      if ($target && $target.page_src && decoded_url === $target.page_src) {
        started = false
        clockRef?.stop()
        final_time = clockRef?.getTime() ?? ''
        gameEndModal?.show()
      }
    } catch (e) {
      console.error(e)
    }
  }
</script>

<GameBar {started} {startGame} bind:clockRef />

{#if loading}
  <div class="flex h-64 w-full items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}

<div class="mockup-browser border-base-300 border {loading && 'hidden'}">
  <div class="mockup-browser-toolbar">
    <div class="input">
      {currentLocation}
    </div>
  </div>
  <iframe
    onload={handleFrameLoad}
    src={started && $start.enc_title ? `/wiki/${$start.enc_title}` : '/wiki/Wikipedia'}
    bind:this={iframeRef}
    title="game window"
    class="h-screen w-full bg-white"
    frameborder="0"
  >
  </iframe>
</div>

<GameEndModal bind:this={gameEndModal} {restart} time={final_time} />

{#if import.meta.env.DEV}
  <DevTools
    modalTrigger={gameEndModal?.show}
    finishGameTrigger={() => {
      const doc = iframeRef?.contentWindow?.document || iframeRef?.contentDocument
      if (doc) doc.location.href = `/wiki/${$target.enc_title}`
    }}
    toastTrigger={() => {
      $toastRef?.addToast('This is a test', 'success')
    }}
    leaderboardTrigger={() => {
      started = false
    }}
  />
{/if}
