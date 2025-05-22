<script>
  import { onDestroy, onMount } from 'svelte';
  import { socket } from './lib/client';

  onMount(async () => {
    socket.connect();
	socket.emit('get-page', "");
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
		<iframe class = "w-full h-screen" src="http://localhost:3000/wiki/India" frameborder="0">
			<link rel="stylesheet" href="https://en.wikipedia.org/w/load.php?modules=skins.vector.styles&only=styles&skin=vector">
		</iframe>
	</div>
</main>

