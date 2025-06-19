<script lang="ts">
  import { start, target } from '$lib/stores/gameState.svelte'
  import { fade } from 'svelte/transition'
  let modal_dial: HTMLDialogElement
  let close_btn: HTMLButtonElement

  let showToast = $state(false)

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
      const url = new URL('/app', window.location.origin)
      url.searchParams.set('start', $start.id.toString())
      url.searchParams.set('end', $target.id.toString())
      console.log(url.toString())
      await navigator.clipboard.writeText(url.toString())

      showToast = true
      setTimeout(() => {
        showToast = false
      }, 5000)
    } catch (e) {
      console.error(e)
    }
  }
</script>

<dialog id="game_over_modal" class="modal" bind:this={modal_dial}>
  {#if showToast}
    <div transition:fade={{ duration: 300 }} class="toast toast-top toast-end">
      <div class="alert alert-success">
        <span>Copied to clipboard!</span>
      </div>
    </div>
  {/if}
  <div class="modal-box">
    <div class="mx-auto max-w-2/3 text-center">
      <h3 class="text-2xl font-bold">SUCCESS!</h3>
      <p class="py-4">Time taken: {time}</p>
      <button class="btn btn-primary" onclick={play_again}>
        <span class="material-symbols-outlined"> replay </span>
        Play again</button
      >
      <button class="btn btn-soft btn-accent" onclick={copy}
        ><span class="material-symbols-outlined"> share </span>Share</button
      >
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button bind:this={close_btn}>close</button>
  </form>
</dialog>
