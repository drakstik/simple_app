<script lang="ts">
  let count: number = $state(0);
  const increment = () => {
    count += 1;
  };
</script>

<button type="button" class="counter" onclick={increment}>
  Frontend count is {count}
</button>
