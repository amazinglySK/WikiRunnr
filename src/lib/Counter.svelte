<script>
  import {socket} from './client'
  let count = $state(0)
  const increment = () => {
    count += 1;
    socket.emit('count+', count);
  }
</script>

<button onclick={increment}>
  count is {count}
</button>
