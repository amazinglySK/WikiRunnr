<script lang="ts">
  import { page } from '$app/state'
  import { PUBLIC_MODE } from '$env/static/public'
  import { onMount } from 'svelte'
  import { initSocket, socket } from '$lib/stores/socket.svelte'
  import { gameInfo, username, isLeader } from '$lib/stores/gameState.svelte'
  import { goto } from '$app/navigation'

  let players = $state(2)
  let code = $state('')

  const joinGame = async () => {
    try {
      const response = await $socket
        ?.timeout(5000)
        .emitWithAck('join_game', $username, code)
      gameInfo.set(response)
      alert(`Game joined!`)
      goto('/app/wait')
    } catch (err) {
      console.error('Failed to join game:', err)
    }
  }
  const startGame = async () => {
    if (!username || !players) {
      alert('Please enter a username')
    }

    if (players == 1) {
    } else {
      try {
        const response = await $socket
          ?.timeout(5000)
          .emitWithAck('new_game', $username)
        gameInfo.set(response)
        alert(`Game created! Code: ${response.code}`)
        $isLeader = true
        goto('/app/wait')
      } catch (err) {
        console.error('Failed to create game:', err)
      }
    }
  }

  onMount(() => {
    if (PUBLIC_MODE == 'MULTI') {
      if (!$socket) {
        initSocket()
      }
    }
  })
</script>

<fieldset
  class="fieldset bg-base-200 border-base-300 rounded-box mx-auto mt-6 w-xs border p-4"
>
  {#if !page.url.searchParams.has('join')}
    <legend class="fieldset-legend">Game settings</legend>

    <label class="label">Number of players</label>
    <input
      type="number"
      class="input"
      placeholder="2"
      min="1"
      max="10"
      bind:value={players}
      required
    />

    <label class="label">Username</label>
    <input
      type="text"
      class="input"
      placeholder="Bombardillo Crocodillo"
      bind:value={$username}
      required
    />

    <button class="btn btn-accent mt-4" onclick={startGame}>Start</button>
    <span class="text-center text-sm"
      >Or <a class="link" href="/app/?join">join</a> a game
    </span>
  {:else}
    <legend class="fieldset-legend">Join game</legend>

    <label class="label">Username</label>
    <input
      type="text"
      class="input"
      placeholder="Bombardillo Crocodillo"
      bind:value={$username}
    />

    <label class="label">Game code</label>
    <input
      type="text"
      class="input"
      placeholder="Enter game code"
      bind:value={code}
    />

    <button class="btn btn-accent mt-4" onclick={joinGame}>Join</button>
    <span class="text-center text-sm"
      >Or <a class="link" href="/app/">start</a> a game</span
    >
  {/if}
</fieldset>
