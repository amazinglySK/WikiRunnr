<script>
  import { onDestroy, onMount } from 'svelte'
  import { socket } from './lib/client'

  const handleFrameLoad = (e) => {
    const doc = e.contentDocument || e.contentWindow.document
    const tw = doc.createElement('script')
    tw.setAttribute('src', 'https://cdn.tailwindcss.com')
    tw.onload = function () {
      doc.body.innerHTML = doc.body.innerHTML //re-render
    }
    doc.head.appendChild(tw)
  }

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
</script>

<main>
  <h1 class="text-xl text-center">WikiRunnr</h1>
  <div class="mx-auto max-w-2/3">
    <iframe
      title="game window"
      class="w-full h-screen"
      src="http://localhost:3000/wiki/India"
      frameborder="0"
      onload={handleFrameLoad}
    >
      <link
        rel="stylesheet"
        href="https://en.wikipedia.org/w/load.php?modules=skins.vector.styles&only=styles&skin=vector"
      />
    </iframe>
  </div>
</main>
