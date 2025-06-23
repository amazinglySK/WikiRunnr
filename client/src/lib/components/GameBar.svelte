<script lang="ts">
  import { soloGame, target } from '../stores/gameState.svelte'
  import Clock from './Clock.svelte'

  let { started, startGame, clockRef = $bindable() } = $props()
</script>

<div
  class="{!started && 'hidden'} flex w-full items-center justify-between py-2"
>
  {#if $soloGame}
    <button
      class={`btn btn-secondary btn-md ${started && 'btn-disabled'}`}
      onclick={() => {
        startGame()
      }}
    >
      Start</button
    >
  {/if}
  <div class="text-md flex items-center gap-2">
    <span class="material-symbols-outlined"> flag </span>
    <span
      ><a
        class="link"
        target="_blank"
        href={`https://en.wikipedia.org/wiki/${$target.enc_title}`}
        >{$target.title}</a
      ></span
    >
  </div>
  <Clock bind:this={clockRef}></Clock>
</div>
