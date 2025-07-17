<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { socket } from '$lib/stores/socket.svelte'
  import Clock from '$lib/components/Clock.svelte'
  import { target, start, inGame, toastRef } from '$lib/stores/gameState.svelte'
  import GameEndModal from '$lib/components/GameEndModal.svelte'
  import { goto } from '$app/navigation'
  import Leaderboard from '$lib/components/Leaderboard.svelte'
  import DevTools from '$lib/components/DevTools.svelte'
  import GameBar from '$lib/components/GameBar.svelte'

  let started = $state(false)
  let currentLocation = $state('')
  let final_time = $state('')
  let gameEndModal: GameEndModal | undefined = $state<GameEndModal>()
  let clockRef: Clock | undefined = $state<Clock>()
  let iframeRef: HTMLIFrameElement | undefined = $state<HTMLIFrameElement>()

  let unsubscribe: any = null
  onMount(async () => {
    unsubscribe = inGame.subscribe((v: boolean) => {
      if (!v) {
        goto('/app/')
      }
    })

    $socket?.on('finisher', (username: string) => {
      $toastRef?.addToast(`${username} finished the game`, 'success')
    })

    $socket?.on('start', async (_) => {
      await startGame()
    })

    await startGame()
  })

  const startGame = async (start_id?: number, end_id?: number) => {
    started = true
    clockRef?.reset()
    clockRef?.start()
  }

  const restart = async () => {
    clockRef?.reset()
    $socket?.emit('restart')
  }

  const endGame = () => {
    $socket?.emit('end_game')
    goto('/app/')
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
        $socket?.emit('finish', clockRef?.getSeconds())
        gameEndModal?.show()
      }
    } catch (e) {
      console.error(e)
    }
  }

  onDestroy(() => {
    if (unsubscribe) unsubscribe()
  })
</script>

<Leaderboard {started} onrestart={restart} onendgame={endGame} />
<GameBar {started} {startGame} bind:clockRef />

<div class="mockup-browser border-base-300 border {!started && 'hidden'}">
  <div class="mockup-browser-toolbar">
    <div class="input">
      {currentLocation}
    </div>
  </div>
  <iframe
    onload={handleFrameLoad}
    src={started && $start?.enc_title
      ? `/wiki/${$start?.enc_title}`
      : '/wiki/Wikipedia'}
    bind:this={iframeRef}
    title="game window"
    class="h-screen w-full bg-white"
    frameborder="0"
  >
  </iframe>
</div>

<GameEndModal bind:this={gameEndModal} {restart} time={final_time} />

<DevTools
  modalTrigger={gameEndModal?.show}
  finishGameTrigger={finishGame}
  toastTrigger={() => {
    $toastRef?.addToast('This is a test', 'success')
  }}
  leaderboardTrigger={() => {
    started = false
  }}
/>
