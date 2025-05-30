<script lang="ts">
  import '../app.css'
  export const ssr = false
  export const csr = true
  let { children } = $props()
</script>

{@render children()}
