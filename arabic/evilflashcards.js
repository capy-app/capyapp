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
        advanced: [
            { front: "التعليم", back: "Education", pronunciation: "at-taalim" },
            { front: "التكنولوجيا", back: "Technology", pronunciation: "at-tekno-lojya" },
            { front: "الاقتصاد", back: "Economy", pronunciation: "al-iqti-saad" },
            { front: "البيئة", back: "Environment", pronunciation: "al-bii'a" },
            { front: "الثقافة", back: "Culture", pronunciation: "ath-thaqafa" },
            { front: "اللغة", back: "Language", pronunciation: "al-lugha" },
            { front: "المجتمع", back: "Society", pronunciation: "al-mujtama" },
            { front: "الحرية", back: "Freedom", pronunciation: "al-hurriya" },
            { front: "العدالة", back: "Justice", pronunciation: "al-‘adala" },
            { front: "التاريخ", back: "History", pronunciation: "at-taarikh" },
            { front: "الفلسفة", back: "Philosophy", pronunciation: "al-falsafa" },
            { front: "الطب", back: "Medicine", pronunciation: "at-tibb" },
            { front: "العلوم", back: "Sciences", pronunciation: "al-‘uloom" },
            { front: "الرياضيات", back: "Mathematics", pronunciation: "ar-riyaadiyaat" },
            { front: "الطبخ", back: "Cooking", pronunciation: "at-tabkh" },
            { front: "الرياضة", back: "Sports", pronunciation: "ar-riyaada" },
            { front: "العمل", back: "Work", pronunciation: "al-‘amal" },
            { front: "الصحة", back: "Health", pronunciation: "as-sihha" },
            { front: "الأسرة", back: "Family", pronunciation: "al-usra" },
            { front: "النجاح", back: "Success", pronunciation: "an-najah" },
            { front: "التحدي", back: "Challenge", pronunciation: "at-tahaddi" },
        ],
        expressions: [
            { front: "أحتاج إلى المساعدة", back: "I need help", pronunciation: "ahtaaj ila al-musa'ada" },
            { front: "هل يمكنك مساعدتي؟", back: "Can you help me?", pronunciation: "hal yumkinuka musa'adati?" },
            { front: "أين يمكنني العثور على...؟", back: "Where can I find...?", pronunciation: "ayn yumkinuni al-‘athoor ‘ala...?" },
            { front: "أريد أن أتعلم", back: "I want to learn", pronunciation: "ureed an ata'allam" },
            { front: "ما رأيك في هذا؟", back: "What do you think of this?", pronunciation: "ma ra'yuka fi hadha?" },
            { front: "أحب هذا المكان", back: "I love this place", pronunciation: "uhibb hadha al-makan" },
            { front: "هل لديك أي أسئلة؟", back: "Do you have any questions?", pronunciation: "hal ladayka ay as'ilah?" },
            { front: "أحتاج إلى وقت", back: "I need time", pronunciation: "ahtaaj ila waqt" },
            { front: "هذا مهم جداً", back: "This is very important", pronunciation: "hadha muhim jiddan" },
            { front: "أريد أن أذهب إلى...", back: "I want to go to...", pronunciation: "ureed an adhhab ila..." },
        ],
        numbers: [
            { front: "واحد وعشرون", back: "Twenty-one", pronunciation: "wahid wa-‘ishroon" },
            { front: "ثلاثون", back: "Thirty", pronunciation: "thalathoon" },
            { front: "أربعون", back: "Forty", pronunciation: "arba'oon" },
            { front: "خمسة", back: "Fifty", pronunciation: "khamsun" },
            { front: "ستون", back: "Sixty", pronunciation: "sittoon" },
            { front: "سبعون", back: "Seventy", pronunciation: "sab'oon" },
            { front: "ثمانون", back: "Eighty", pronunciation: "thama'oon" },
            { front: "تسعون", back: "Ninety", pronunciation: "tis'oon" },
            { front: "مئة", back: "One hundred", pronunciation: "mi'a" },
            { front: "ألف", back: "One thousand", pronunciation: "alf" },
        ],
    };

    // Load the initial deck
    currentDeck = flashcardsData.advanced; // Set the initial deck to advanced
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
            cardPronunciation.textContent = currentCard.pronunciation; // Update pronunciation for back
            currentCardDisplay.textContent = currentCardIndex + 1; // Display current card index
            totalCardsDisplay.textContent = currentDeck.length; // Display total cards
        }
    }

    // Navigate to the next card
    nextCardButton.addEventListener('click', function() {
        currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
        showCard();
    });

    // Navigate to the previous card
    prevCardButton.addEventListener('click', function() {
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
                currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
                showCard();
            }, 3000); // Change card every 3 seconds
            this.textContent = "Stop Auto Play"; // Change button text
        }
    });

    // Helper function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});

const easyModeButton = document.getElementById('easymode-button');
const hardModeButton = document.getElementById('hardmode-button');

easyModeButton.addEventListener('click', function() {
    window.location.href = 'flashcards.html'; // Redirect to beginner modes
});

hardModeButton.addEventListener('click', function() {
    window.location.href = 'evilflashcards.html'; // Redirect to expert mode
});