<script lang="ts">
    let loading = false;
    let userId = "";
    let error: string | null = null;

    async function createUser() {
        loading = true;
        error = null;

        try {
            const res = await fetch("/api/newUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("Failed to create user");

            const data = await res.json();
            userId = data.user.id;
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<button on:click={createUser} disabled={loading}>
    {loading ? "Creating..." : "Create New User"}
</button>

{#if userId}
    <p>Success! New User ID: <strong>{userId}</strong></p>
{/if}

{#if error}
    <p style="color: red;">{error}</p>
{/if}
