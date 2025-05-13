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
        advanced: [  // Changed from advanced_vocabulary to match HTML data-deck attribute
            { front: "Pamahalaan", back: "Government" },
            { front: "Kalakalan", back: "Commerce" },
            { front: "Sining", back: "Art" },
            { front: "Panitikan", back: "Literature" },
            { front: "Pamana", back: "Heritage" },
            { front: "Pangangatwiran", back: "Reasoning" },
            { front: "Pagpapahusay", back: "Improvement" },
            { front: "Pagkakakilanlan", back: "Identity" },
            { front: "Pagsusuri", back: "Analysis" },
            { front: "Pagbabago", back: "Change" },
            { front: "Pagkakaiba", back: "Difference" },
            { front: "Pagtutulungan", back: "Collaboration" },
            { front: "Pagpapasya", back: "Decision" },
            { front: "Pangangalaga", back: "Preservation" },
            { front: "Pag-unlad", back: "Development" },
            { front: "Pagiging tunay", back: "Authenticity" },
            { front: "Pagkamalikhain", back: "Creativity" },
            { front: "Pagtitiwala", back: "Trust" },
            { front: "Pagkakapantay-pantay", back: "Equality" },
            { front: "Pagkamabisa", back: "Effectiveness" },
            { front: "Pagtitiis", back: "Perseverance" },
        ],
        expressions: [  // Changed from complex_phrases to match HTML data-deck attribute
            { front: "Ano ang iyong pananaw?", back: "What is your perspective?" },
            { front: "Paano natin malulutas ito?", back: "How can we resolve this?" },
            { front: "Bakit mahalaga ang layuning ito?", back: "Why is this goal important?" },
            { front: "Ano ang naging inspirasyon mo?", back: "What inspired you?" },
            { front: "Paano mo ito ipapaliwanag?", back: "How would you explain this?" },
            { front: "Saan nagmula ang ideyang ito?", back: "Where did this idea come from?" },
            { front: "Ano ang magiging epekto nito?", back: "What will be its impact?" },
            { front: "Paano natin mapapanatili ang ganito?", back: "How can we sustain this?" },
            { front: "Bakit kailangang bigyang-pansin ito?", back: "Why does this need attention?" },
            { front: "Ano ang maaari nating gawin upang mapabuti?", back: "What can we do to improve?" },
        ],
        numbers: [  // Changed from abstract_concepts to match HTML data-deck attribute
            { front: "Katarungan", back: "Justice" },
            { front: "Kalayaan", back: "Freedom" },
            { front: "Karangalan", back: "Honor" },
            { front: "Katotohanan", back: "Truth" },
            { front: "Pag-ibig", back: "Love" },
            { front: "Pag-asa", back: "Hope" },
            { front: "Kapayapaan", back: "Peace" },
            { front: "Katapatan", back: "Loyalty" },
            { front: "Karunungan", back: "Wisdom" },
            { front: "Kagandahan", back: "Beauty" },
        ],
    };

    // Load the initial deck
    currentDeck = flashcardsData.advanced; // This now correctly matches a deck name
    currentCardIndex = 0;
    totalCardsDisplay.textContent = currentDeck.length;
    showCard();

    // Event listeners for deck selection
    deckOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedDeck = this.getAttribute('data-deck');
            currentDeck = flashcardsData[selectedDeck];
            currentCardIndex = 0;
            totalCardsDisplay.textContent = currentDeck.length;
            showCard();
        });
    });

    // Show the current card
    function showCard() {
        if (currentDeck.length > 0) {
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
        showCard();
    });

    // Auto play functionality
    autoPlayButton.addEventListener('click', function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            this.textContent = "Auto Play"; // Reset button text
        } else {
            autoPlayInterval = setInterval(() => {
                // Reset the card to front side for each new card
                const flashcardInner = document.querySelector('.flashcard-inner');
                flashcardInner.classList.remove('flipped');
                
                currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
                showCard();
            }, 3000); // Change card every 3 seconds
            this.textContent = "Stop Auto Play"; // Change button text
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