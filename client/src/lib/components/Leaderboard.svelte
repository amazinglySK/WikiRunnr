<script lang="ts">
  import {
    isLeader,
    gameCode,
    gameInfo,
    soloGame,
  } from '../stores/gameState.svelte'
  import { socket } from '../stores/socket.svelte'

  let { started, onrestart } = $props()

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const restart = () => {
    $socket?.emit('restart', $gameCode)
    onrestart()
  }
</script>

{#if !started && !$soloGame}
  <div class="mx-auto w-3/5">
    <ul class="list bg-base-100 rounded-box shadow-md">
      <li class="p-4 pb-2 text-lg tracking-wide opacity-60">Leaderboard</li>

      {#each $gameInfo?.lb as player, index}
        <li class="list-row">
          <div class="text-3xl font-thin tabular-nums opacity-30">
            #{index + 1}
          </div>
          <div class="list-col-grow align-middle text-lg">
            {player.name}
          </div>
          <div class="text-lg">{formatTime(player.time)}</div>
        </li>
      {/each}
    </ul>
    {#if $isLeader}
      <div>
        <button class="btn btn-primary" onclick={restart}>Restart Game</button>
      </div>
    {/if}
  </div>
{/if}
