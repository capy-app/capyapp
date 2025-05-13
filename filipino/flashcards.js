document.addEventListener('DOMContentLoaded', function() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    const deckOptions = document.querySelectorAll('.deck-option');
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');
    const cardPronunciation = document.getElementById('card-pronunciation');
    const prevCardButton = document.getElementById('prev-card');
    const nextCardButton = document.getElementById('next-card');
    const flipCardButton = document.getElementById('flip-card');
    const shuffleButton = document.getElementById('shuffle-deck');
    const autoPlayButton = document.getElementById('auto-play');
    const currentCardDisplay = document.getElementById('current-card');
    const totalCardsDisplay = document.getElementById('total-cards');

    let currentDeck = [];
    let currentCardIndex = 0;
    let autoPlayInterval;

    // Sample flashcard data
    const flashcardsData = {
        basics: [
            { front: 'Kamusta', back: 'Hello' },
            { front: 'Kamusta ka?', back: 'How are you?' },
            { front: 'Ano ang pangalan mo?', back: 'What is your name?' },
            { front: 'Masaya ako', back: 'I am happy' },
            { front: 'Malungkot ako', back: 'I am sad' },
            { front: 'Gutom ako', back: 'I am hungry' },
            { front: 'Uhaw ako', back: 'I am thirsty' },
            { front: 'Pagod ako', back: 'I am tired' },
            { front: 'Natutulog ako', back: 'I am sleeping' },
            { front: 'Gising ako', back: 'I am awake' },
            { front: 'Naliligo ako', back: 'I am taking a shower' },
            { front: 'Nagbibihis ako', back: 'I am dressing' },
            { front: 'Kumakain ako', back: 'I am eating' },
            { front: 'Umiinom ako', back: 'I am drinking' },
            { front: 'Nagbabasa ako', back: 'I am reading' },
            { front: 'Nagsusulat ako', back: 'I am writing' },
            { front: 'Nakikinig ako', back: 'I am listening' },
            { front: 'Nagsasalita ako', back: 'I am speaking' },
            { front: 'Pupunta ako', back: 'I am going' },
            { front: 'Nagsasabi ako', back: 'I am saying' },
            { front: 'Nag-iisip ako', back: 'I am thinking' },
            { front: 'Mahal ko', back: 'I love' },
        ],
        greetings: [
            { front: 'Magandang umaga', back: 'Good morning' },
            { front: 'Magandang gabi', back: 'Good evening' },
            { front: 'Kumusta', back: 'Hello' },
            { front: 'Paalam', back: 'Goodbye' },
            { front: 'Kita tayo mamaya', back: 'See you later' },
            { front: 'Sige', back: 'Okay' },
            { front: 'Hindi', back: 'No' },
            { front: 'Oo', back: 'Yes' },
            { front: 'Salamat', back: 'Thank you' },
            { front: 'Patawad', back: 'Excuse me' },
            { front: 'Pakikalmahan', back: 'Please' },
            { front: 'Kamusta ka?', back: 'How are you?' },
            { front: 'Ano ang pangalan mo?', back: 'What is your name?' },
            { front: 'Masaya ako', back: 'I am happy' },
            { front: 'Malungkot ako', back: 'I am sad' },
            { front: 'Gutom ako', back: 'I am hungry' },
            { front: 'Uhaw ako', back: 'I am thirsty' },
            { front: 'Pagod ako', back: 'I am tired' },
            { front: 'Natutulog ako', back: 'I am sleeping' },
            { front: 'Gising ako', back: 'I am awake' },
            { front: 'Naliligo ako', back: 'I am taking a shower' },
        ],
        numbers: [
            { front: 'Isa', back: 'One' },
            { front: 'Dalawa', back: 'Two' },
            { front: 'Tatlo', back: 'Three' },
            { front: 'Apat', back: 'Four' },
            { front: 'Lima', back: 'Five' },
            { front: 'Anim', back: 'Six' },
            { front: 'Pito', back: 'Seven' },
            { front: 'Walo', back: 'Eight' },
            { front: 'Siyam', back: 'Nine' },
            { front: 'Sampu', back: 'Ten' },
            { front: 'Labing-isa', back: 'Eleven' },
            { front: 'Labing-dalawa', back: 'Twelve' },
            { front: 'Labing-tatlo', back: 'Thirteen' },
            { front: 'Labing-apat', back: 'Fourteen' },
            { front: 'Labing-lima', back: 'Fifteen' },
            { front: 'Labing-anim', back: 'Sixteen' },
            { front: 'Labing-pito', back: 'Seventeen' },
            { front: 'Labing-walo', back: 'Eighteen' },
            { front: 'Labing-siyam', back: 'Nineteen' },
            { front: 'Dalawampu', back: 'Twenty' },
        ],
    };

    // Load the initial deck
    currentDeck = flashcardsData.basics; // Fixed: Using 'basics' instead of 'advanced'
    currentCardIndex = 0;
    totalCardsDisplay.textContent = currentDeck.length;
    showCard();

    // Event listeners for deck selection
    deckOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedDeck = this.getAttribute('data-deck');
            currentDeck = flashcardsData[selectedDeck];
            currentCardIndex = 0;
            
            // Make sure the card is not flipped when switching decks
            const flashcardInner = document.querySelector('.flashcard-inner');
            flashcardInner.classList.remove('flipped');
            
            totalCardsDisplay.textContent = currentDeck.length;
            showCard();
        });
    });

    // Show the current card
    function showCard() {
        if (currentDeck && currentDeck.length > 0) {
            const currentCard = currentDeck[currentCardIndex];
            cardFront.textContent = currentCard.front;
            cardBack.textContent = currentCard.back;
            
            // Check if pronunciation exists before trying to display it
            if (currentCard.pronunciation) {
                cardPronunciation.textContent = currentCard.pronunciation;
                cardPronunciation.style.display = 'block';
            } else {
                cardPronunciation.style.display = 'none';
            }
            
            currentCardDisplay.textContent = currentCardIndex + 1; // Display current card index
            totalCardsDisplay.textContent = currentDeck.length; // Display total cards
        } else {
            console.error("Current deck is undefined or empty");
        }
    }

    // Navigate to the next card
    nextCardButton.addEventListener('click', function() {
        // Reset the card to front side before showing next card
        const flashcardInner = document.querySelector('.flashcard-inner');
        flashcardInner.classList.remove('flipped');
        
        currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
        showCard();
    });

    // Navigate to the previous card
    prevCardButton.addEventListener('click', function() {
        // Reset the card to front side before showing previous card
        const flashcardInner = document.querySelector('.flashcard-inner');
        flashcardInner.classList.remove('flipped');
        
        currentCardIndex = (currentCardIndex - 1 + currentDeck.length) % currentDeck.length;
        showCard();
    });

    // Flip the card
    flipCardButton.addEventListener('click', function() {
        const flashcardInner = document.querySelector('.flashcard-inner');
        flashcardInner.classList.toggle('flipped'); // Toggle the flipped class
    });

    // Shuffle the deck
    shuffleButton.addEventListener('click', function() {
        currentDeck = shuffleArray(currentDeck);
        currentCardIndex = 0;
        
        // Make sure the card is not flipped after shuffling
        const flashcardInner = document.querySelector('.flashcard-inner');
        flashcardInner.classList.remove('flipped');
        
        showCard();
    });

    // Auto play functionality
    autoPlayButton.addEventListener('click', function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            this.textContent = "Auto Play"; // Reset button text
            this.innerHTML = '<i class="fa-solid fa-play"></i> Auto Play';
        } else {
            autoPlayInterval = setInterval(() => {
                // Reset the card to front side for each new card
                const flashcardInner = document.querySelector('.flashcard-inner');
                flashcardInner.classList.remove('flipped');
                
                currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
                showCard();
            }, 3000); // Change card every 3 seconds
            this.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Auto Play'; // Change button text with icon
        }
    });

    // Helper function to shuffle an array
    function shuffleArray(array) {
        let arrayCopy = [...array]; // Create a copy of the array to avoid modifying the original
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }
});

// Level change buttons
const easyModeButton = document.getElementById('easymode-button');
const hardModeButton = document.getElementById('hardmode-button');

easyModeButton.addEventListener('click', function() {
    window.location.href = 'flashcards.html'; // Redirect to beginner modes
});

hardModeButton.addEventListener('click', function() {
    window.location.href = 'evilflashcards.html'; // Redirect to expert mode
});