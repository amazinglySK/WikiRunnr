<script lang="ts">
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
</script>

<dialog id="game_over_modal" class="modal" bind:this={modal_dial}>
  <div class="modal-box">
    <div class="mx-auto max-w-2/3 text-center">
      <h3 class="text-2xl font-bold">SUCCESS!</h3>
      <p class="py-4">Time taken: {time}</p>
      <button class="btn btn-primary" onclick={play_again}>
        <span class="material-symbols-outlined"> replay </span>
        Play again</button
      >
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button bind:this={close_btn}>close</button>
  </form>
</dialog>
