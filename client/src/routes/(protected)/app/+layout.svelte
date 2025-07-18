<script lang="ts">
  import { initSocket, socket } from '$lib/stores/socket.svelte'
  import { onMount } from 'svelte'

  onMount(() => {
    if (!$socket) initSocket()
  })

  let { children } = $props()
</script>

{@render children()}
