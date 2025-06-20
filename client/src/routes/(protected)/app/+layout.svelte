<script lang="ts">
  import { initSocket } from '$lib/stores/socket.svelte'
  import { onMount } from 'svelte'

  onMount(() => {
    console.log('Running this')
    initSocket()
  })

  let { children } = $props()
</script>

{@render children()}
