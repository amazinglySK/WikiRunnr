<script>
  import { onDestroy, onMount } from 'svelte'
  import { socket } from './lib/client'
  import { page_url, target } from './stores/socket.js'

  onMount(async () => {
    socket.connect()
    socket.emit('get-page', '')
  })

  onDestroy(() => {
    if (!socket) {
      console.log('Entered this branch')
      return
    }

    socket.disconnect()
    socket.off('connect')
    socket.off('disconnect')
  })

  const startGame = async () => {
    alert('clicked')
    socket.emit('start')
  }
</script>

<main>
  <h1 class="text-xl text-center">WikiRunnr</h1>
  <div class="mx-auto max-w-2/3">
    <button class="px-3 py-2 bg-red-300 text-white" onclick={startGame}>
      Start</button
    >
    <span>{$target}</span>
    <iframe
      title="game window"
      class="w-full h-screen"
      src={$page_url
        ? `http://localhost:3000/wiki/${$page_url}`
        : 'http://localhost:3000/wiki/Wikipedia'}
      frameborder="0"
    >
      <link
        rel="stylesheet"
        href="https://en.wikipedia.org/w/load.php?modules=skins.vector.styles&only=styles&skin=vector"
      />
    </iframe>
  </div>
</main>
