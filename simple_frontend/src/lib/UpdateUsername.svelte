<script lang="ts">
    let dialog: HTMLDialogElement;
    let userId = "";
    let newUsername = "";
    let loading = false;
    let message = "";

    async function handleUpdate() {
        if (!userId || !newUsername) return alert("Please fill in both fields");

        loading = true;
        message = "";

        try {
            const res = await fetch("/api/updateUsername", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, username: newUsername }),
            });

            const data = await res.json();

            if (res.ok) {
                message = `Success! New username: ${data.user.username}`;
                dialog.close(); // Close modal on success
                // Clear inputs
                userId = "";
                newUsername = "";
            } else {
                message = `Error: ${data.message || "Failed to update"}`;
            }
        } catch (err) {
            message = "Network error occured.";
        } finally {
            loading = false;
        }
    }
</script>

<!-- Trigger Button -->
<button on:click={() => dialog.showModal()}> Update Username </button>

<!-- Modal Popup -->
<dialog bind:this={dialog}>
    <div class="modal-content">
        <h3>Update User Settings</h3>

        <label for="uid">User ID (UUID):</label>
        <input
            id="uid"
            type="text"
            bind:value={userId}
            placeholder="Paste UUID here"
        />

        <label for="uname">New Username:</label>
        <input
            id="uname"
            type="text"
            bind:value={newUsername}
            placeholder="Enter new name"
        />

        <div class="actions">
            <button class="cancel" on:click={() => dialog.close()}
                >Cancel</button
            >
            <button class="submit" on:click={handleUpdate} disabled={loading}>
                {loading ? "Updating..." : "Submit"}
            </button>
        </div>
    </div>
</dialog>

{#if message}
    <p class="status">{message}</p>
{/if}

<style>
    dialog {
        border-radius: 8px;
        border: 1px solid #ccc;
        padding: 2rem;
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }
    .modal-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    input {
        padding: 0.5rem;
        width: 300px;
    }
    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 1rem;
    }
    .submit {
        background-color: #4caf50;
        color: white;
    }
    .cancel {
        background-color: #f44336;
        color: white;
    }
    .status {
        font-weight: bold;
        margin-top: 10px;
    }
</style>
