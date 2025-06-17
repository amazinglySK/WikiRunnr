<main class="flex h-screen items-center">
  <form method="POST" class="mx-auto flex max-w-max flex-col gap-2">
    <fieldset
      class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
    >
      <legend class="fieldset-legend">Enter access code</legend>
      <input
        name="access_code"
        type="text"
        class="input input-lg"
        placeholder="Type here"
      />
      <p class="label">*Required</p>
    </fieldset>
    <button class="btn btn-soft btn-accent">Get access</button>
  </form>
</main>
