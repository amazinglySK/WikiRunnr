<script lang="ts">
  import { soloGame } from '../stores/gameState.svelte'
  let { modalTrigger, finishGameTrigger, toastTrigger, leaderboardTrigger } =
    $props()
</script>

{#if import.meta.env.DEV}
  <div id="dev-tools" class="mx-auto my-4 text-center">
    <button class="btn btn-soft btn-primary" onclick={modalTrigger}
      >Test modal</button
    >
    <button class="btn btn-soft btn-primary" onclick={finishGameTrigger}
      >Finish game</button
    >

    <button class="btn btn-soft btn-primary" onclick={toastTrigger}
      >Test toast</button
    >

    {#if !$soloGame}
      <button class="btn btn-soft btn-primary" onclick={leaderboardTrigger}
        >Show leaderboard</button
      >
    {/if}
  </div>
{/if}
