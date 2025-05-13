document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.querySelector('.textbox');
    const sendButton = document.getElementById('send-button');
    const responseDisplay = document.querySelector('.response-display');
    const capybaraImage = document.getElementById('capybara');
    
    // Set character limit for responses
    const MAX_RESPONSE_LENGTH = 250;
    
    // API Key - NOTE: You should never expose API keys in client-side JavaScript in production!
    const API_KEY = "AIzaSyDYOdEfjsD0JT8FPYyqxGRA1V304E2y1U8";
    
    // Initial greeting
    responseDisplay.textContent = "مرحباً! (Marhaban!) Would you like to learn some Arabic today?";
    
    sendButton.addEventListener('click', function() {
        sendMessageToGemini();
    });
    
    // Also trigger send on Enter key
    textInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessageToGemini();
        }
    });
    
    function sendMessageToGemini() {
        const userMessage = textInput.value.trim();
        
        if (!userMessage) return;
        
        // Show loading indicator
        responseDisplay.textContent = "Thinking...";
        
        // Prepare the data for Gemini 2.0 Flash
        const requestBody = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `Act as an Arabic language tutor named Capy. Keep your response under ${MAX_RESPONSE_LENGTH} characters.
                            
                            Guidelines:
                            - Include at least one Arabic word/phrase with pronunciation and translation
                            - Focus on beginner-friendly language learning
                            - Use positive reinforcement
                            - Correct Arabic usage gently
                            - Act like a capybara (eg. You live like a Capybara and enjoy things Capybaras like, but )
                            - Avoid emojis
                            - Remember the previous requests from this conversation
                            
                            User message: ${userMessage}`
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 100,
                temperature: 0.7
            }
        };
        
        console.log("Sending request to Gemini API...");
        
        // Updated API endpoint for Gemini 2.0 Flash
        fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                return response.json().then(errorData => {
                    console.error("API Error Details:", errorData);
                    throw new Error(`API Error ${response.status}: ${errorData.error?.message || JSON.stringify(errorData)}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);
            
            let geminiResponse = "";
            
            try {
                // Extract response from the correct path in the data
                geminiResponse = data.candidates[0].content.parts[0].text;
                
                // Truncate if needed
                if (geminiResponse.length > MAX_RESPONSE_LENGTH) {
                    geminiResponse = geminiResponse.substring(0, MAX_RESPONSE_LENGTH) + "...";
                }
                
                // Display the response
                responseDisplay.textContent = geminiResponse;
                
                // Change to Arabic capybara design when responding
                if (capybaraImage) {
                    capybaraImage.src = "assets/capy-ar.png";
                }
                
            } catch (error) {
                console.error('Error extracting response:', error);
                console.error('Response data:', data);
                responseDisplay.textContent = "عفواً (Afwan - Sorry), I couldn't process that.";
            }
            
            // Clear input field
            textInput.value = '';
        })
        .catch(error => {
            console.error('Error:', error);
            responseDisplay.textContent = "عفواً (Afwan - Sorry), something went wrong connecting to the AI.";
        });
    }
});

const capybaraImages = [
    'assets/capyph.png',
    'assets/capyar.png',
    'assets/capygold.png',
    'assets/capyrscarf.png',
    'assets/capygscarf.png',
    'assets/capybow.png',
];

function shuffleCapybara() {
    const randomIndex = Math.floor(Math.random() * capybaraImages.length);
    capybara.src = capybaraImages[randomIndex];
}

const shuffleButton = document.getElementById('shuffle-button');
shuffleButton.addEventListener('click', shuffleCapybara);

