<script>
  import { onDestroy, onMount } from 'svelte';
  import {socket} from './lib/client';
  import { frameData } from './lib/stores.js';

  let htmlContent;
  onMount(async () => {
    socket.connect();
	socket.emit('get-page', "https://en.wikipedia.org/wiki/India");
    frame.addEventListener('load', onLoad)
  });

  onDestroy(() => {
    if (!socket) {
        console.log("Entered this branch");
        return;
    }

    socket.disconnect();
    socket.off('connect');
    socket.off('disconnect');
  });


</script>

<main>
    <h1 class = "text-xl text-center" >WikiRunnr</h1>
	<div class = "mx-auto max-w-2/3">
		<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?modules=skins.vector.styles&only=styles&skin=vector">
	{@html $frameData}
	</div>
</main>

<style>
    #gameWindow {
        width:100%;
        height:640px;
    }
</style>
