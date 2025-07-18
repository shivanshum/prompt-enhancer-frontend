document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('userInput');
    const outputPrompt = document.getElementById('outputPrompt');
    const generateBtn = document.getElementById('generatePrompt');
    const clearBtn = document.getElementById('clearInput');
    const copyBtn = document.getElementById('copyPrompt');

    generateBtn.addEventListener('click', async () => {
        const userText = userInput.value.trim();
        if (userText === '') {
            outputPrompt.value = 'Please enter your request first!';
            return;
        }

        outputPrompt.value = 'Generating prompt... Please wait.'; // Provide user feedback
        generateBtn.disabled = true; // Disable button to prevent multiple clicks

        try {
            // Send the user's request to your backend server
            const response = await fetch('https://ai-prompt-enhancer-m5y0.onrender.com/generate-prompt', { // IMPORTANT: Change 'http://localhost:3000' to your deployed backend URL later
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userRequest: userText })
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 400, 500) from your backend
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            outputPrompt.value = data.engineeredPrompt; // Display the prompt from the backend

        } catch (error) {
            console.error('Error:', error);
            outputPrompt.value = `Error generating prompt: ${error.message}. Please try again.`;
        } finally {
            generateBtn.disabled = false; // Re-enable the button
        }
    });

    clearBtn.addEventListener('click', () => {
        userInput.value = '';
        outputPrompt.value = '';
    });

    copyBtn.addEventListener('click', () => {
        if (outputPrompt.value) {
            navigator.clipboard.writeText(outputPrompt.value)
                .then(() => {
                    alert('Prompt copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy prompt. Please copy manually.');
                });
        } else {
            alert('No prompt to copy!');
        }
    });
});