<script lang="ts">
  import {
    start,
    target,
    soloGame,
    toastRef,
  } from '$lib/stores/gameState.svelte'

  let modal_dial: HTMLDialogElement
  let close_btn: HTMLButtonElement

  export const show = () => {
    modal_dial?.showModal()
  }

  let { restart, time } = $props()

  const shareUrl = $derived(
    typeof window !== 'undefined' && $start?.id && $target?.id
      ? `${window.location.origin}/game/solo?start=${$start.id}&end=${$target.id}`
      : '',
  )

  const play_again = () => {
    restart()
    close_btn?.click()
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      $toastRef?.addToast('Challenge link copied!')
    } catch (e) {
      console.error(e)
    }
  }
</script>

<dialog id="game_over_modal" class="modal" bind:this={modal_dial}>
  <div class="modal-box">
    <div class="mx-auto text-center">
      <h3 class="text-2xl font-bold">SUCCESS!</h3>
      <div class="mt-3 flex justify-center gap-2 text-lg opacity-70">
        <span class="material-symbols-outlined text-base">timer</span>
        <span>{time}</span>
      </div>

      <div class="mt-5 flex justify-center gap-2">
        {#if $soloGame}
          <button class="btn btn-primary" onclick={play_again}>
            <span class="material-symbols-outlined">replay</span>
            Play again
          </button>
        {/if}
      </div>

      {#if $soloGame && shareUrl}
        <div class="mt-4">
          <p class="mb-1 text-xs opacity-60">Challenge a friend</p>
          <div class="join w-full">
            <input
              class="input join-item input-sm w-full font-mono text-xs"
              value={shareUrl}
              readonly
            />
            <button
              class="btn btn-sm join-item btn-accent"
              onclick={copyShareUrl}
              title="Copy link"
            >
              <span class="material-symbols-outlined text-base">content_copy</span>
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button bind:this={close_btn}>close</button>
  </form>
</dialog>
