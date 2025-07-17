<script lang="ts">
  import {
    gameInfo,
    gameCode,
    isLeader,
    username,
  } from '$lib/stores/gameState.svelte'
  import Avatar from '$lib/components/Avatar.svelte'
  import { socket } from '$lib/stores/socket.svelte'

  const onStart = () => {
    if (!$gameInfo?.code) {
      alert('Something went wrong')
    }
    $socket?.emit('start')
  }

  const copy_code = async () => {
    try {
      await navigator.clipboard.writeText($gameCode)
    } catch (e) {
      console.error(e)
    }
  }

  const kick = async (idx: number) => {
    const player = $gameInfo?.players.at(idx)
    $socket?.emit('kick_player', player)
  }
</script>

<div class="w-full">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined"> account_circle </span>
      <span class="text-xl">{$username}</span>
    </div>
    <div
      class="bg-base-300 rounded-box flex items-center gap-2 px-4 py-2 text-lg"
    >
      <span>{$gameInfo?.code}</span>
      <button
        onclick={() => {
          copy_code()
        }}
        class="btn btn-square btn-ghost"
      >
        <span class="material-symbols-outlined"> content_copy </span>
      </button>
    </div>
  </div>
  <ul class="list bg-base-100 rounded-box shadow-md">
    {#each $gameInfo?.players ?? [] as player, idx}
      <li class="list-row">
        <div>
          <Avatar seed={player.id} />
        </div>
        <div class="flex h-full items-center">
          <div class="text-xl">{player.username}</div>
        </div>
        {#if $isLeader}
          <button
            class="btn btn-square btn-ghost"
            onclick={() => {
              kick(idx)
            }}><span class="material-symbols-outlined"> close </span></button
          >
        {/if}
      </li>
    {/each}
  </ul>
  {#if $isLeader}
    <div class="w-full text-center">
      <button class="btn btn-accent mt-4" onclick={onStart}>Start Game</button>
    </div>
  {/if}
</div>
