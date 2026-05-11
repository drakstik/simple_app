<script lang="ts">
    let dialog: HTMLDialogElement;
    let username = "";
    let password = "";
    let loading = false;

    async function handleRegister() {
        // Basic client-side validation
        if (!username || !password) {
            return alert("Please enter both a username and a password.");
        }

        loading = true;

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Success: Alert the user and reset form
                alert(
                    `Successfully created new user with username: ${data.username}`,
                );
                username = "";
                password = "";
                dialog.close();
            } else {
                // Error: Handle backend validation or server errors
                // Express-validator returns an 'errors' array, others might return 'error'
                const errorMsg = data.errors
                    ? data.errors.map((e: any) => e.msg).join(", ")
                    : data.error || "Registration failed";

                alert(`Error: ${errorMsg}`);
            }
        } catch (err) {
            alert("Network error: Could not connect to the server.");
        } finally {
            loading = false;
        }
    }

    function closeDialog() {
        username = "";
        password = "";
        dialog.close();
    }
</script>

<!-- Trigger Button -->
<button class="join-btn" on:click={() => dialog.showModal()}>
    Become a Member
</button>

<!-- Modal Popup -->
<dialog bind:this={dialog}>
    <div class="modal-content">
        <h3>Create an Account</h3>

        <label for="reg-uname">Username</label>
        <input
            id="reg-uname"
            type="text"
            bind:value={username}
            placeholder="Choose a username"
            disabled={loading}
        />

        <label for="reg-password">Password</label>
        <input
            id="reg-password"
            type="password"
            bind:value={password}
            placeholder="At least 12 characters"
            disabled={loading}
        />

        <div class="actions">
            <button class="cancel" on:click={closeDialog} disabled={loading}>
                Cancel
            </button>
            <button class="done" on:click={handleRegister} disabled={loading}>
                {loading ? "Creating..." : "Done"}
            </button>
        </div>
    </div>
</dialog>

<style>
    dialog {
        border-radius: 12px;
        border: 1px solid #ddd;
        padding: 2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
    }
    .modal-content {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    h3 {
        margin-top: 0;
        color: #333;
    }
    label {
        font-size: 0.9rem;
        font-weight: bold;
        color: #666;
    }
    input {
        padding: 0.6rem;
        width: 280px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
    .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 1.5rem;
    }
    button {
        padding: 0.6rem 1.2rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 600;
    }
    .join-btn {
        background-color: #6366f1;
        color: white;
        font-size: 1rem;
    }
    .done {
        background-color: #22c55e;
        color: white;
    }
    .done:disabled {
        background-color: #86efac;
        cursor: not-allowed;
    }
    .cancel {
        background-color: #ef4444;
        color: white;
    }
</style>
