document.addEventListener('DOMContentLoaded', function() {
    const flashcardContainer = document.querySelector('.flashcard-container');
    const deckOptions = document.querySelectorAll('.deck-option');
    const cardFront = document.getElementById('card-front');
    const cardBack = document.getElementById('card-back');
    const cardPronunciation = document.getElementById('card-pronunciation'); // For back pronunciation
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
            { front: 'مرحبا', back: 'Hello', pronunciation: 'marhaban' },
            { front: 'كيف حالك؟', back: 'How are you?', pronunciation: 'kayfa halak?' },
            { front: 'ما اسمك؟', back: 'What is your name?', pronunciation: 'ma ismuk?' },
            { front: 'أنا سعيد', back: 'I am happy', pronunciation: 'ana saeed' },
            { front: 'أنا حزين', back: 'I am sad', pronunciation: 'ana hazin' },
            { front: 'أنا جائع', back: 'I am hungry', pronunciation: 'ana jaeen' },
            { front: 'أنا عطشان', back: 'I am thirsty', pronunciation: 'ana atshan' },
            { front: 'أنا متعب', back: 'I am tired', pronunciation: 'ana mutaab' },
            { front: 'أنا نائم', back: 'I am sleeping', pronunciation: 'ana naeem' },
            { front: 'أنا مستيقظ', back: 'I am awake', pronunciation: 'ana mustayqiz' },
            { front: 'أنا أستحم', back: 'I am taking a shower', pronunciation: 'ana astahim' },
            { front: 'أنا أرتدي', back: 'I am dressing', pronunciation: 'ana artadi' },
            { front: 'أنا أكل', back: 'I am eating', pronunciation: 'ana akul' },
            { front: 'أنا أشرب', back: 'I am drinking', pronunciation: 'ana ashurb' },
            { front: 'أنا أقرأ', back: 'I am reading', pronunciation: 'ana aqraa' },
            { front: 'أنا أكتب', back: 'I am writing', pronunciation: 'ana aktub' },
            { front: 'أنا أسمع', back: 'I am listening', pronunciation: 'ana asmaa' },
            { front: 'أنا أتحدث', back: 'I am speaking', pronunciation: 'ana atahadath' },
            { front: 'أنا أذهب', back: 'I am going', pronunciation: 'ana adhab' },
            { front: 'أنا أقول', back: 'I am saying', pronunciation: 'ana aqul' },
            { front: 'أنا أفكر', back: 'I am thinking', pronunciation: 'ana afkur' },
            { front: 'أنا أحب', back: 'I love', pronunciation: 'ana uhibb' },
        ],
        greetings: [
            { front: 'صباح الخير', back: 'Good morning', pronunciation: 'sabah al-khayr' },
            { front: 'مساء الخير', back: 'Good evening', pronunciation: 'masa al-khayr' },
            { front: 'مرحبا', back: 'Hello', pronunciation: 'marhaban' },
            { front: 'مع السلامة', back: 'Goodbye', pronunciation: 'maa al-salaama' },
            { front: 'إلى اللقاء', back: 'See you later', pronunciation: 'ila al-liqaa' },
            { front: 'حسنا', back: 'Okay', pronunciation: 'hasan' },
            { front: 'لا', back: 'No', pronunciation: 'laa' },
            { front: 'نعم', back: 'Yes', pronunciation: 'naam' },
            { front: 'شكرا', back: 'Thank you', pronunciation: 'shukraan' },
            { front: 'أفوا', back: 'Excuse me', pronunciation: 'afwan' },
            { front: 'لو سمحت', back: 'Please', pronunciation: 'law samaht' },
            { front: 'كيف حالك؟', back: 'How are you?', pronunciation: 'kayfa halak?' },
            { front: 'ما اسمك؟', back: 'What is your name?', pronunciation: 'ma ismuk?' },
            { front: 'أنا سعيد', back: 'I am happy', pronunciation: 'ana saeed' },
            { front: 'أنا حزين', back: 'I am sad', pronunciation: 'ana hazin' },
            { front: 'أنا جائع', back: 'I am hungry', pronunciation: 'ana jaeen' },
            { front: 'أنا عطشان', back: 'I am thirsty', pronunciation: 'ana atshan' },
            { front: 'أنا متعب', back: 'I am tired', pronunciation: 'ana mutaab' },
            { front: 'أنا نائم', back: 'I am sleeping', pronunciation: 'ana naeem' },
            { front: 'أنا مستيقظ', back: 'I am awake', pronunciation: 'ana mustayqiz' },
            { front: 'أنا أستحم', back: 'I am taking a shower', pronunciation: 'ana astahim' },
        ],
        numbers: [
            { front: 'واحد', back: 'One', pronunciation: 'wahid' },
            { front: 'اثنان', back: 'Two', pronunciation: 'ithnan' },
            { front: 'ثلاثة', back: 'Three', pronunciation: 'thalathah' },
            { front: 'أربعة', back: 'Four', pronunciation: 'arbaah' },
            { front: 'خمسة', back: 'Five', pronunciation: 'khamsah' },
            { front: 'ستة', back: 'Six', pronunciation: 'sittah' },
            { front: 'سبعة', back: 'Seven', pronunciation: 'sabah' },
            { front: 'ثمانية', back: 'Eight', pronunciation: 'thamaaniyah' },
            { front: 'تسعة', back: 'Nine', pronunciation: 'tisah' },
            { front: 'عشرة', back: 'Ten', pronunciation: 'asharah' },
            { front: 'أحد عشر', back: 'Eleven', pronunciation: 'ahad ashrah' },
            { front: 'اثنا عشر', back: 'Twelve', pronunciation: 'ithna ashrah' },
            { front: 'ثلاثة عشر', back: 'Thirteen', pronunciation: 'thalathah ashrah' },
            { front: 'أربعة عشر', back: 'Fourteen', pronunciation: 'arbaah ashrah' },
            { front: 'خمسة عشر', back: 'Fifteen', pronunciation: 'khamsah ashrah' },
            { front: 'ستة عشر', back: 'Sixteen', pronunciation: 'sittah ashrah' },
            { front: 'سبعة عشر', back: 'Seventeen', pronunciation: 'sabah ashrah' },
            { front: 'ثمانية عشر', back: 'Eighteen', pronunciation: 'thamaaniyah ashrah' },
            { front: 'تسعة عشر', back: 'Nineteen', pronunciation: 'tisah ashrah' },
            { front: 'عشرون', back: 'Twenty', pronunciation: 'ishroon' },
        ],
    };

    // Load the initial deck
    currentDeck = flashcardsData.basics; // Set the initial deck to basics
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
            this.textContent = 'Auto Play'; // Reset button text
        } else {
            autoPlayInterval = setInterval(() => {
                currentCardIndex = (currentCardIndex + 1) % currentDeck.length;
                showCard();
            }, 3000); // Change card every 3 seconds
            this.textContent = 'Stop Auto Play'; // Change button text
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
    window.location.href = 'flashcards.html'; // Redirect to beginner mode
});

hardModeButton.addEventListener('click', function() {
    window.location.href = 'evilflashcards.html'; // Redirect to expert mode
});