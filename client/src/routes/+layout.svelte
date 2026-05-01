<script lang="ts">
  import '../app.css'
  import { initSocket, socket } from '$lib/stores/socket.svelte'
  import { toastRef } from '$lib/stores/gameState.svelte'
  import Toast from '$lib/components/Toast.svelte'
  import { onDestroy, onMount } from 'svelte'

  onMount(() => {
    if (!$socket) {
      console.log('Running the socket initialization')
      initSocket()
    }

    return () => {
      if ($socket) {
        $socket.close()
        console.log('Socket closed')
      }
    }
  })

  let { children } = $props()
</script>

<svelte:head>
  <title>WikiRunnr</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👟</text></svg>"
  />
</svelte:head>
<h1 class="pt-3 text-center text-4xl font-bold">
  <a href="/">WikiRunnr</a>
</h1>
{#if import.meta.env.DEV}
  <p class="text-center">(Debug Mode)</p>
  {#if $socket != null}
    <p class="text-center">Socket ID: {$socket.id}</p>
  {/if}
{/if}
<main class="mx-auto max-w-3/4">
  {@render children()}
  <Toast bind:this={$toastRef} />
</main>
<footer class="footer footer-center text-base-content p-4">
  <p class="text-md inline">
    Made with love by <a class="link" href="https://github.com/amazinglysk"
      >amazinglysk</a
    >
  </p>
</footer>
