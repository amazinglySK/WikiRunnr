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

  const play_again = () => {
    restart()
    close_btn?.click()
  }

  const copy = async () => {
    try {
      const url = new URL('/game/solo', window.location.origin)
      url.searchParams.set('start', $start.id.toString())
      url.searchParams.set('end', $target.id.toString())
      await navigator.clipboard.writeText(url.toString())
      close_btn?.click()
      $toastRef?.addToast('Copied to clipboard')
    } catch (e) {
      console.error(e)
    }
  }
</script>

<dialog id="game_over_modal" class="modal" bind:this={modal_dial}>
  <div class="modal-box">
    <div class="mx-auto max-w-2/3 text-center">
      <h3 class="text-2xl font-bold">SUCCESS!</h3>
      <p class="py-4">Time taken: {time}</p>
      {#if $soloGame}
        <button class="btn btn-primary" onclick={play_again}>
          <span class="material-symbols-outlined"> replay </span>
          Play again</button
        >
      {/if}
      <button class="btn btn-soft btn-accent" onclick={copy}
        ><span class="material-symbols-outlined"> share </span>Share</button
      >
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button bind:this={close_btn}>close</button>
  </form>
</dialog>
