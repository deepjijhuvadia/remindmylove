document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');

    const showMessage = (message, isError = false) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${isError ? 'error' : 'success'}`;
        messageDiv.style.display = 'block';

        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim()
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message);
                form.reset();
            } else {
                showMessage(data.message || 'Registration failed. Please try again.', true);
            }
        } catch (error) {
            showMessage('An error occurred. Please try again later.', true);
            console.error('Registration error:', error);
        }
    });

    // Optional: Add pause functionality
    const pauseReminders = async (email, duration) => {
        try {
            const response = await fetch('/pause', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, duration })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message);
            } else {
                showMessage(data.message || 'Failed to pause reminders.', true);
            }
        } catch (error) {
            showMessage('An error occurred while pausing reminders.', true);
            console.error('Pause error:', error);
        }
    };

    // Optional: Add unsubscribe functionality
    const unsubscribe = async (email) => {
        try {
            const response = await fetch('/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message);
            } else {
                showMessage(data.message || 'Failed to unsubscribe.', true);
            }
        } catch (error) {
            showMessage('An error occurred while unsubscribing.', true);
            console.error('Unsubscribe error:', error);
        }
    };
});
