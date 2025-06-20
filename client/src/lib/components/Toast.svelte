<script lang="ts">
  import { fade } from 'svelte/transition'
  let message = $state('')
  let showToast = $state(false)

  export function show(msg: string) {
    message = msg
    showToast = true
    setTimeout(() => {
      showToast = false
    }, 5000)
  }
</script>

{#if showToast}
  <div transition:fade={{ duration: 300 }} class="toast">
    <div class="alert alert-success alert-soft">
      <span>{message}</span>
    </div>
  </div>
{/if}
