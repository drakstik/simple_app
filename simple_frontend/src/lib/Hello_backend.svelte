<script lang="ts">
    let message = "";
    let loading = false;
    let error: string | null = null;

    async function fetchMessage() {
        loading = true;
        error = null;
        message = "";

        try {
            const res = await fetch("/api/hello_backend");

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            message = data.message;
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<button
    type="button"
    class="counter"
    on:click={fetchMessage}
    disabled={loading}
>
    {loading ? "Loading..." : "Get Message from API"}
</button>

{#if error}
    <div style="color: red; margin-top: 1em;">
        Error: {error}
    </div>
{/if}

{#if message}
    <div style="font-size: 1.2em; margin-top: 1em;">
        {message}
    </div>
{/if}
