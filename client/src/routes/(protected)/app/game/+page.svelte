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
  import { page } from '$app/state'
  import Toast from '$lib/components/Toast.svelte'
  import Leaderboard from '$lib/components/Leaderboard.svelte'
  import DevTools from '$lib/components/DevTools.svelte'
  import GameBar from '$lib/components/GameBar.svelte'

  let started = $state(false)
  let currentLocation = $state('')
  let final_time = $state('')
  let gameEndModal: GameEndModal | undefined = $state<GameEndModal>()
  let clockRef: Clock | undefined = $state<Clock>()
  let iframeRef: HTMLIFrameElement | undefined = $state<HTMLIFrameElement>()
  let toastRef: Toast | undefined = $state<Toast>()

  onMount(async () => {
    if ($soloGame) {
      console.log('HELLO')
      const params = page.url.searchParams
      let start_id = parseInt(params.get('start') ?? '')
      let end_id = parseInt(params.get('end') ?? '')

      if (start_id && end_id) {
        await startGame(start_id, end_id)
      } else {
        console.log('Starting game')
        await startGame()
      }
    } else {
      $socket?.on('finisher', (username: string) => {
        toastRef?.show(`${username} finished the game`)
      })

      $socket?.on('start', async (_) => {
        await startGame()
      })

      await startGame()
    }
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
    if ($soloGame) {
      await startSoloGame()
      started = true
      clockRef?.start()
    } else {
      $socket?.emit('restart')
    }
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
        clockRef?.stop()
        final_time = clockRef?.getTime() ?? ''
        if (!$soloGame)
          $socket?.emit('finish', $gameInfo.code, clockRef?.getSeconds())
        gameEndModal?.show()
      }
    } catch (e) {
      console.log('Oops something went wrong')
      console.error(e)
    }
  }
</script>

<Leaderboard {started} onrestart={restart} />
<GameBar {started} {startGame} bind:clockRef />

<div
  class="mockup-browser border-base-300 border {!started &&
    !$soloGame &&
    'hidden'}"
>
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

<DevTools
  modalTrigger={gameEndModal?.show}
  finishGameTrigger={finishGame}
  toastTrigger={() => {
    toastRef?.show('This is a test')
  }}
  leaderboardTrigger={() => {
    started = false
  }}
/>
