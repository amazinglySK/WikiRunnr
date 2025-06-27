<script lang="ts">
  import { inGame } from '$lib/stores/gameState.svelte'
  import { goto } from '$app/navigation'
  import { onDestroy, onMount } from 'svelte'

  let unsubscribe: any = null
  onMount(() => {
    unsubscribe = inGame.subscribe((v: boolean) => {
      if (!v) {
        goto('/app/')
      }
    })
    console.log('Initiated inGame check')
  })

  onDestroy(() => {
    if (unsubscribe) unsubscribe()
  })

  let { children } = $props()
</script>

{@render children()}
