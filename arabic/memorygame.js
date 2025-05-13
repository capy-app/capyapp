document.addEventListener('DOMContentLoaded', () => {
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
            { front: "العدالة", back: "Justice", pronunciation: "al-'adala" },
            { front: "التاريخ", back: "History", pronunciation: "at-taarikh" },
            { front: "الفلسفة", back: "Philosophy", pronunciation: "al-falsafa" },
            { front: "الطب", back: "Medicine", pronunciation: "at-tibb" },
            { front: "العلوم", back: "Sciences", pronunciation: "al-'uloom" },
            { front: "الرياضيات", back: "Mathematics", pronunciation: "ar-riyaadiyaat" },
            { front: "الطبخ", back: "Cooking", pronunciation: "at-tabkh" },
            { front: "الرياضة", back: "Sports", pronunciation: "ar-riyaada" },
            { front: "العمل", back: "Work", pronunciation: "al-'amal" },
            { front: "الصحة", back: "Health", pronunciation: "as-sihha" },
            { front: "الأسرة", back: "Family", pronunciation: "al-usra" },
            { front: "النجاح", back: "Success", pronunciation: "an-najah" },
            { front: "التحدي", back: "Challenge", pronunciation: "at-tahaddi" },
        ]
    };

    const gridContainer = document.getElementById('grid-container');
    const restartButton = document.getElementById('restart-button');
    const feedback = document.getElementById('feedback');

    let cards = [];
    let firstCard, secondCard;
    let lockBoard = false;
    let matchedPairs = 0;
    const totalPairs = 12; // For a 2x6 grid (14 cards)

    function initializeGame() {
        // Reset game state
        cards = [];
        matchedPairs = 0;
        feedback.textContent = '';
        gridContainer.innerHTML = '';

        // Create a deck of cards
        const selectedCards = flashcardsData.advanced.slice(0, totalPairs / 2); // Select 8 unique cards
        const doubleCards = [...selectedCards, ...selectedCards]; // Duplicate for pairs
        
        // Shuffle the cards
        shuffleArray(doubleCards);

        // Create card elements
        doubleCards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;

            // Create inner card structure
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            cardFront.innerHTML = '?'; // Show a question mark initially

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            
            // Show both Arabic and English
            const arabicText = document.createElement('div');
            arabicText.classList.add('arabic');
            arabicText.textContent = card.front;
            
            const englishText = document.createElement('div');
            englishText.classList.add('english');
            englishText.textContent = card.back;
            
            cardBack.appendChild(arabicText);
            cardBack.appendChild(englishText);

            // Append front and back to inner card
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);

            // Add click event listener to each card
            cardElement.addEventListener('click', flipCard);
            gridContainer.appendChild(cardElement);
            
            // Store reference to card element
            cards.push(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return; // Prevent flipping if board is locked
        if (this === firstCard) return; // Prevent clicking the same card twice
        if (this.querySelector('.card-inner.matched')) return; // Prevent clicking already matched cards
        
        const cardInner = this.querySelector('.card-inner');
        if (!cardInner) return; // Skip if it's the free space
        
        cardInner.classList.add('flipped'); // Flip the card

        if (!firstCard) {
            // This is the first card flipped
            firstCard = this;
            return;
        }

        // This is the second card flipped
        secondCard = this;
        lockBoard = true; // Lock the board to prevent further clicks

        checkForMatch();
    }

    function checkForMatch() {
        // Get the Arabic text from both cards
        const firstCardArabic = firstCard.querySelector('.arabic')?.textContent;
        const secondCardArabic = secondCard.querySelector('.arabic')?.textContent;

        const isMatch = firstCardArabic === secondCardArabic;

        if (isMatch) {
            // It's a match! Mark cards as matched
            disableCards();
            matchedPairs++;
            
            // Check if all pairs are found
            if (matchedPairs === totalPairs / 2) {
                setTimeout(() => {
                    feedback.textContent = 'Congratulations! You found all pairs!';
                }, 500);
            }
        } else {
            // Not a match, flip the cards back
            unflipCards();
        }
    }

    function disableCards() {
        // Mark cards as matched
        firstCard.querySelector('.card-inner').classList.add('matched');
        secondCard.querySelector('.card-inner').classList.add('matched');
        
        // Reset board for next selection
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.querySelector('.card-inner').classList.remove('flipped');
            secondCard.querySelector('.card-inner').classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    restartButton.addEventListener('click', () => {
        initializeGame(); // Restart the game
    });

    // Initialize the game on page load
    initializeGame();
});