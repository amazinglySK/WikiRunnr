<script lang="ts">
  import '../app.css'
  export const ssr = false
  export const csr = true
  let { children } = $props()
</script>

<svelte:head>
  <title>WikiRunnr</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👟</text></svg>"
  />
</svelte:head>
{@render children()}
<footer class="footer footer-center text-base-content p-4">
  <p class="text-md inline">
    Made with love by <a class="link" href="https://github.com/amazinglysk"
      >amazinglysk</a
    >
  </p>
</footer>
