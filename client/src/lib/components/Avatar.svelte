<script lang="ts">
  import { createAvatar } from '@dicebear/core'
  import { notionistsNeutral } from '@dicebear/collection'
  let { seed } = $props()

  const avatar_url = createAvatar(notionistsNeutral, {
    size: 128,
    seed,
  }).toDataUri()
</script>

<div class="avatar">
  <div class="w-10">
    <img src={avatar_url} alt="Avatar" />
  </div>
</div>
