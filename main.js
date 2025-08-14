document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');
    const pauseBtn = document.getElementById('pauseBtn');
    const unsubscribeBtn = document.getElementById('unsubscribeBtn');

    let currentUserEmail = '';

    const showMessage = (message, isError = false) => {
        messageDiv.textContent = message;
        messageDiv.className = `message ${isError ? 'error' : 'success'}`;
        messageDiv.style.display = 'block';

        // Hide message after 8 seconds for longer messages
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 8000);
    };

    // Handle pause reminders
    const pauseReminders = async () => {
        if (!currentUserEmail) {
            showMessage('Please register first to pause reminders.', true);
            return;
        }

        const duration = prompt('How many days would you like to pause reminders? (1-7):', '3');
        if (!duration || isNaN(duration) || duration < 1 || duration > 7) {
            showMessage('Please enter a valid number between 1 and 7.', true);
            return;
        }

        try {
            const response = await fetch('/pause', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: currentUserEmail, duration: parseInt(duration) })
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

    // Handle unsubscribe
    const unsubscribe = async () => {
        if (!currentUserEmail) {
            showMessage('Please register first to unsubscribe.', true);
            return;
        }

        const confirmed = confirm('Are you sure you want to unsubscribe from wellness reminders? You can always register again later.');
        if (!confirmed) return;

        try {
            const response = await fetch('/unsubscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: currentUserEmail })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(data.message);
                form.reset();
                currentUserEmail = '';
            } else {
                showMessage(data.message || 'Failed to unsubscribe.', true);
            }
        } catch (error) {
            showMessage('An error occurred while unsubscribing.', true);
            console.error('Unsubscribe error:', error);
        }
    };

    // Form submission
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
                currentUserEmail = formData.email;
                form.reset();
            } else {
                showMessage(data.message || 'Registration failed. Please try again.', true);
            }
        } catch (error) {
            showMessage('An error occurred. Please try again later.', true);
            console.error('Registration error:', error);
        }
    });

    // Event listeners
    pauseBtn.addEventListener('click', pauseReminders);
    unsubscribeBtn.addEventListener('click', unsubscribe);
});
