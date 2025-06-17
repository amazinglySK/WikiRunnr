<script lang="ts">
  import '../app.css'
  let { children } = $props()
</script>

<svelte:head>
  <title>WikiRunnr</title>
  <link
    rel="icon"
    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👟</text></svg>"
  />
</svelte:head>
<h1 class="pt-3 text-center text-4xl font-bold">WikiRunnr</h1>
{#if import.meta.env.DEV}
  <p class="text-center">(Debug Mode)</p>
{/if}
<main class="mx-auto max-w-3/4">
  {@render children()}
</main>
<footer class="footer footer-center text-base-content p-4">
  <p class="text-md inline">
    Made with love by <a class="link" href="https://github.com/amazinglysk"
      >amazinglysk</a
    >
  </p>
</footer>
