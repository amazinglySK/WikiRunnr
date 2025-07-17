<script lang="ts">
  import { fade } from 'svelte/transition'

  interface Toast {
    id: number
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    timeout: number
  }

  let toasts: Toast[] = $state([])
  let nextId = 0

  export function addToast(
    message: string,
    type: Toast['type'] = 'success',
    duration: number = 5000,
  ) {
    const id = nextId++
    const newToast: Toast = { id, message, type, timeout: duration }

    toasts = [newToast, ...toasts] // Add new toast to top of stack
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id: number) {
    toasts = toasts.filter((toast) => toast.id !== id)
  }
</script>

<div class="toast toast-end">
  {#each toasts as toast (toast.id)}
    <div
      in:fade={{ duration: 300 }}
      out:fade={{ duration: 300 }}
      class="alert alert-{toast.type} alert-soft"
    >
      <span>{toast.message}</span>
    </div>
  {/each}
</div>
