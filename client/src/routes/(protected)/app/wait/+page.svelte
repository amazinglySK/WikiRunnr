<script lang="ts">
  import { gameInfo, isLeader, username } from '$lib/stores/gameState.svelte'
  import { socket } from '$lib/stores/socket.svelte'
  console.log($gameInfo)

  const onStart = () => {
    if (!$gameInfo?.code) {
      alert('Something went wrong')
    }
    $socket?.emit('start', $gameInfo?.code)
  }
</script>

<span>Game code: {$gameInfo?.code}</span>
<span>Username: {$username}</span>
<ul class="joined">
  {#each $gameInfo?.players ?? [] as player}
    <li>{player.username}</li>
  {/each}
</ul>

{#if $isLeader}
  <button class="btn btn-accent" onclick={onStart}>Start Game</button>
{/if}
