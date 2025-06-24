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

  const copy_code = async () => {
    try {
      const code = $gameInfo?.code
      await navigator.clipboard.writeText(code)
      alert('copied the game code')
    } catch (e) {
      console.error(e)
    }
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
    {#each $gameInfo?.players ?? [] as player}
      <li class="list-row">
        <div>
          <img
            class="rounded-box size-10"
            src="https://img.daisyui.com/images/profile/demo/1@94.webp"
          />
        </div>
        <div class="flex h-full items-center">
          <div class="text-xl">{player.username}</div>
        </div>
        {#if $isLeader}
          <button class="btn btn-square btn-ghost"
            ><span class="material-symbols-outlined"> close </span></button
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
