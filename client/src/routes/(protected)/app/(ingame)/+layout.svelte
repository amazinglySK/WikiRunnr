<script lang="ts">
  import { inGame, soloGame} from '$lib/stores/gameState.svelte'
  import { goto } from '$app/navigation'
  import { onDestroy, onMount } from 'svelte'

  let unsubscribe: any = null
  onMount(() => {
  if (!$soloGame){
    unsubscribe = inGame.subscribe((v: boolean) => {
      if (!v) {
        goto('/app/')
      }
    })
  }
  })

  onDestroy(() => {
    if (unsubscribe) unsubscribe()
  })

  let { children } = $props()
</script>

{@render children()}
