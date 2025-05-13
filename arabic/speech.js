let recognition; // Variable for speech recognition

function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition(); // Create a new instance of SpeechRecognition
        recognition.continuous = false; // Stop automatically after a single recognition
        recognition.interimResults = false; // Do not return interim results
        recognition.lang = 'ar-SA'; // Set language to Arabic (Saudi Arabia)

        recognition.onstart = function() {
            console.log("Speech recognition started.");
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript; // Get the recognized text
            console.log("Recognized text:", transcript); // Log the recognized text
            // You can display the recognized text in your application
            const textInput = document.querySelector('.textbox'); // Assuming you have a textbox to display the result
            textInput.value = transcript; // Set the recognized text to the input field
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error); // Log any errors
        };

        recognition.onend = function() {
            console.log("Speech recognition ended.");
            const micButton = document.getElementById('mic-button');
            micButton.classList.remove('listening'); // Remove the 'listening' class
            micButton.innerHTML = '<i class="fa-solid fa-microphone"></i>'; // Change icon back to normal
        };
    } else {
        console.error("Speech recognition not supported in this browser.");
    }
}

// Call this function to initialize speech recognition
initializeSpeechRecognition();