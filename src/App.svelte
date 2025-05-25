<script>
  import { onDestroy, onMount } from 'svelte'
  import { socket } from './lib/client'
  import { start, target } from './stores/socket.js'

  onMount(async () => {
    socket.connect()
    socket.emit('get-page', '')
  })

  onDestroy(() => {
    if (!socket) {
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

  const handleFrameLoad = async (e) => {
    try {
      const doc = e.target.contentWindow.document || e.target.contentDocument
      const decoded_url = decodeURIComponent(doc.location.href)
        .split('/')
        .at(-1)
      console.log(decoded_url, $target.page_src)
      if ($target.page_src && decoded_url === $target.page_src) {
        alert('Eureka!')
      }
    } catch (e) {
      console.log('Oops something went wrong')
      console.error(e)
    }
  }
</script>

<main>
  <h1 class="text-xl text-center">WikiRunnr</h1>
  <div class="mx-auto max-w-2/3">
    <button class="px-3 py-2 bg-red-300 text-white" onclick={startGame}>
      Start</button
    >
    <span>{$target.title}</span>
    <iframe
      onload={handleFrameLoad}
      src={$start.enc_title ? `/wiki/${$start.enc_title}` : '/wiki/Wikipedia'}
      title="game window"
      class="w-full h-screen"
      frameborder="0"
    >
    </iframe>
  </div>
</main>
