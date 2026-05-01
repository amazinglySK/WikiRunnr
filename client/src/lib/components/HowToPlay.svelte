<script lang="ts">
  import { onMount } from 'svelte'

  const STORAGE_KEY = 'wikirunnr_seen_how_to_play'
  let modal: HTMLDialogElement

  onMount(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      modal?.showModal()
      localStorage.setItem(STORAGE_KEY, '1')
    }
  })

  export const show = () => modal?.showModal()
</script>

<dialog class="modal" bind:this={modal}>
  <div class="modal-box max-w-md">
    <h3 class="mb-4 text-2xl font-bold">How to Play</h3>
    <ul class="space-y-4 text-sm">
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-accent mt-0.5">shuffle</span>
        <p>
          You're given a <strong>start</strong> article and a
          <strong>target</strong> article on Wikipedia.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-accent mt-0.5">link</span>
        <p>
          Navigate from start to target by <strong>clicking links</strong> within
          the articles. No searching allowed.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-accent mt-0.5">timer</span>
        <p>
          Your time and click count are tracked. Reach the target as
          <strong>fast as possible</strong> with as <strong>few clicks</strong> as
          you can.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-accent mt-0.5">group</span>
        <p>
          Play solo or race <strong>up to 10 friends</strong> in real-time using a
          shared game code.
        </p>
      </li>
      <li class="flex items-start gap-3">
        <span class="material-symbols-outlined text-accent mt-0.5">share</span>
        <p>
          After a solo run, <strong>share your exact route</strong> so friends can
          race you on the same start and target.
        </p>
      </li>
    </ul>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn btn-accent">Let's go!</button>
      </form>
    </div>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
