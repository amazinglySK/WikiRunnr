<script lang="ts">
  import { page } from '$app/state'
  import { socket } from '$lib/stores/socket.svelte'
  import {
    gameInfo,
    username,
    isLeader,
    soloGame,
    toastRef,
  } from '$lib/stores/gameState.svelte'
  import { goto } from '$app/navigation'
  import HowToPlay from '$lib/components/HowToPlay.svelte'

  let players = $state(2)
  let code = $state('')
  let loading = $state(false)
  let howToPlayRef: HowToPlay | undefined = $state()

  const joinGame = async () => {
    if (!$username?.trim()) {
      $toastRef?.addToast('Please enter a username', 'error')
      return
    }
    loading = true
    try {
      const [err, response] = await $socket
        ?.timeout(5000)
        .emitWithAck('join_game', $username, code)
      if (err) {
        $toastRef?.addToast(err.message, 'error')
        return
      }
      soloGame.set(false)
      gameInfo.set(response)
      goto('/wait')
    } catch (err) {
      console.error('Failed to join game:', err)
      $toastRef?.addToast('Facing some network issues', 'error')
    } finally {
      loading = false
    }
  }

  const startGame = async () => {
    if (!$username?.trim()) {
      $toastRef?.addToast('Please enter a username', 'error')
      return
    }

    if (players == 1) {
      soloGame.set(true)
      goto('/game/solo')
      return
    }

    loading = true
    try {
      const [err, response] = await $socket
        ?.timeout(5000)
        .emitWithAck('new_game', $username, players)
      if (err) {
        $toastRef?.addToast(err.message, 'error')
        return
      }
      gameInfo.set(response)
      $isLeader = true
      soloGame.set(false)
      goto('/wait')
    } catch (err) {
      console.error('Failed to create game:', err)
      $toastRef?.addToast('Facing some network issues', 'error')
    } finally {
      loading = false
    }
  }
</script>

<HowToPlay bind:this={howToPlayRef} />

<fieldset
  class="fieldset bg-base-200 border-base-300 rounded-box mx-auto mt-6 w-xs border p-4"
>
  {#if !page.url.searchParams.has('join')}
    <legend class="fieldset-legend">Game settings</legend>

    <label for="num_players" class="label">Number of players</label>
    <input
      id="num_players"
      type="number"
      class="input"
      placeholder="2"
      min="1"
      max="10"
      bind:value={players}
      required
    />

    <label for="username" class="label">Username</label>
    <input
      id="username"
      type="text"
      class="input"
      placeholder="Bombardillo Crocodillo"
      bind:value={$username}
      required
    />

    <button class="btn btn-accent mt-4" disabled={loading} onclick={startGame}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
      {:else}
        Start
      {/if}
    </button>
    <span class="text-center text-sm"
      >Or <a class="link" href="/?join">join</a> a game
    </span>
    <span class="text-center text-sm">
      <button class="link" onclick={() => howToPlayRef?.show()}>How to play</button>
    </span>
  {:else}
    <legend class="fieldset-legend">Join game</legend>

    <label for="username_join" class="label">Username</label>
    <input
      id="username_join"
      type="text"
      class="input"
      placeholder="Bombardillo Crocodillo"
      bind:value={$username}
    />

    <label for="game_code" class="label">Game code</label>
    <input
      id="game_code"
      type="text"
      class="input"
      placeholder="Enter game code"
      bind:value={code}
    />

    <button class="btn btn-accent mt-4" disabled={loading} onclick={joinGame}>
      {#if loading}
        <span class="loading loading-spinner loading-sm"></span>
      {:else}
        Join
      {/if}
    </button>
    <span class="text-center text-sm"
      >Or <a class="link" href="/">start</a> a game &nbsp;·&nbsp;
      <button class="link" onclick={() => howToPlayRef?.show()}>How to play</button>
    </span>
  {/if}
</fieldset>
