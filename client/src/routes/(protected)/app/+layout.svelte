<script lang="ts">
  import { initSocket } from '$lib/stores/socket.svelte'
  import { onMount } from 'svelte'

  onMount(() => {
    initSocket()
  })

  let { children } = $props()
</script>

{@render children()}
