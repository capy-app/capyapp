// Arabic sounds database with phonetic representation and audio file names
const arabicSounds = [
    { id: "ism", phonetic: "ما اسمك؟", latin: "Ma ismuk?", audioFile: "sounds/ism.mp3" },
    { id: "omr", phonetic: "كم عمرك؟", latin: "Kam omruk?", audioFile: "sounds/omr.mp3" },
    { id: "fifteen", phonetic: "عمري خمسة عشر سنة.", latin: "Omri khamsata 'ashar sana.", audioFile: "sounds/fifteen.mp3" },
    { id: "from", phonetic: "من أين أنت؟", latin: "Min ayna anta?", audioFile: "sounds/from.mp3" },
    { id: "philippines", phonetic: "أنا من الفلبين.", latin: "Ana min al-Filippin.", audioFile: "sounds/philippines.mp3" },
    { id: "live", phonetic: "أين تعيش؟", latin: "Ayna ta'eesh?", audioFile: "sounds/live.mp3" },
    { id: "dubai", phonetic: "أنا أعيش في دبي.", latin: "Ana a'eesh fi Dubai.", audioFile: "sounds/dubai.mp3" },
    { id: "hobby", phonetic: "ما هي هوايتك؟", latin: "Ma hiya hiwayatuk?", audioFile: "sounds/hobby.mp3" },
    { id: "movies", phonetic: "مشاهدة الأفلام.", latin: "Mushahadat al-aflam.", audioFile: "sounds/movies.mp3" },
    { id: "grade", phonetic: "في أي صف أنت؟", latin: "Fi ayi saff anta?", audioFile: "sounds/grade.mp3" },
    { id: "ten", phonetic: "أنا في الصف العاشر.", latin: "Ana fi al-saff al-‘ashir.", audioFile: "sounds/ten.mp3" },
    { id: "color", phonetic: "ما هو لونك المفضل؟", latin: "Ma huwa lawnuk al-mufaddal?", audioFile: "sounds/color.mp3" },
    { id: "pink", phonetic: "لوني المفضل هو الوردي.", latin: "Lawni al-mufaddal huwa al-wardi.", audioFile: "sounds/pink.mp3" },
    { id: "howareyou", phonetic: "كيف حالك اليوم؟", latin: "Kayfa haluk alyawm?", audioFile: "sounds/howareyou.mp3" },
    { id: "fine", phonetic: "أنا بخير.", latin: "Ana bikhayr.", audioFile: "sounds/fine.mp3" },
    { id: "dream", phonetic: "ما هي وجهتك الحلم؟", latin: "Ma hiya wijhatuka al-hulm?", audioFile: "sounds/dream.mp3" },
    { id: "paris", phonetic: "وجهتي الحلم هي باريس.", latin: "Wijhati al-hulm hiya Baris.", audioFile: "sounds/paris.mp3" },
    { id: "drink", phonetic: "ما هو مشروبك المفضل؟", latin: "Ma huwa mashrubuk al-mufaddal?", audioFile: "sounds/drink.mp3" },
    { id: "avocado", phonetic: "مشروبي المفضل هو عصير الأفوكادو.", latin: "Mashrubi al-mufaddal huwa 'aseer al-avocado.", audioFile: "sounds/avocado.mp3" },
    { id: "there", phonetic: "هل وصلنا؟", latin: "Hal wasalna?", audioFile: "sounds/there.mp3" }
];

document.addEventListener('DOMContentLoaded', function() {
    // Game state variables
    let currentSound = null;
    let currentOptions = [];
    let correctAnswer = null;
    let playCount = 0;
    let maxPlays = 3;
    let score = 0;
    let totalQuestions = 10;
    let currentQuestion = 1;
    let audio = new Audio();
    
    // DOM elements
    const playButton = document.getElementById('play-sound');
    const replayButton = document.getElementById('replay-sound');
    const playsCount = document.getElementById('plays-count');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const feedback = document.getElementById('feedback');
    const correctFeedback = document.getElementById('correct-feedback');
    const incorrectFeedback = document.getElementById('incorrect-feedback');
    const correctAnswerSpan = document.getElementById('correct-answer');
    const nextButton = document.getElementById('next-question');
    const progressBar = document.getElementById('progress-bar');
    const currentScoreDisplay = document.getElementById('current-score');
    const questionCounter = document.getElementById('question-counter');
    
    // Settings button toggle
    const settingsButton = document.getElementById('settings-button');
    const settingsSubmenu = document.querySelector('.settings-submenu');
    
    // Setup dropdown toggle functionality
    if (settingsButton && settingsSubmenu) {
        // Make sure dropdown is initially hidden
        settingsSubmenu.classList.remove('show');
        
        // Toggle dropdown when clicking settings button
        settingsButton.addEventListener('click', function(event) {
            event.stopPropagation();
            settingsSubmenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking elsewhere on the page
        document.addEventListener('click', function() {
            settingsSubmenu.classList.remove('show');
        });
        
        // Prevent clicks inside dropdown from closing it
        settingsSubmenu.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }
    
    // Theme switcher functionality
    const lightmodeButton = document.getElementById('lightmode-button');
    const darkmodeButton = document.getElementById('darkmode-button');
    
    if (lightmodeButton) {
        lightmodeButton.addEventListener('click', function() {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            settingsSubmenu.classList.remove('show');
        });
    }
    
    if (darkmodeButton) {
        darkmodeButton.addEventListener('click', function() {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            settingsSubmenu.classList.remove('show');
        });
    }
    
    // Initialize the quiz
    function initQuiz() {
        generateQuestion();
        updateProgress();
        updateScore();
    }
    
    // Generate a new question
    function generateQuestion() {
        playCount = 0;
        updatePlaysCount();
        
        // Randomly select a sound
        const randomIndex = Math.floor(Math.random() * arabicSounds.length);
        currentSound = arabicSounds[randomIndex];
        correctAnswer = currentSound;
        
        // Get 3 other random sounds for options
        let otherSounds = [...arabicSounds];
        otherSounds.splice(randomIndex, 1);
        shuffleArray(otherSounds);
        otherSounds = otherSounds.slice(0, 3);
        
        // Combine correct answer with other options and shuffle
        currentOptions = [correctAnswer, ...otherSounds];
        shuffleArray(currentOptions);
        
        // Update answer buttons
        answerButtons.forEach((button, index) => {
            const option = currentOptions[index];
            button.textContent = `${option.phonetic} (${option.latin})`;
            button.dataset.answerId = option.id;
            button.classList.remove('btn-success', 'btn-danger');
            button.classList.add('btn-outline-primary');
            button.disabled = false;
        });
        
        // Reset feedback
        feedback.style.display = 'none';
        correctFeedback.style.display = 'none';
        incorrectFeedback.style.display = 'none';
        
        // Preload audio
        audio.src = currentSound.audioFile;
        audio.load();
    }
    
    // Play the current sound
    function playSound() {
        if (playCount < maxPlays) {
            audio.play();
            playCount++;
            updatePlaysCount();
        }
    }
    
    // Update plays count display
    function updatePlaysCount() {
        playsCount.textContent = `${playCount}/${maxPlays}`;
        replayButton.disabled = playCount >= maxPlays;
    }
    
    // Handle answer selection
    function handleAnswer(event) {
        const selectedButton = event.target;
        const selectedAnswerId = selectedButton.dataset.answerId;
        
        // Disable all buttons
        answerButtons.forEach(button => {
            button.disabled = true;
        });
        
        // Show feedback
        feedback.style.display = 'block';
        
        if (selectedAnswerId === correctAnswer.id) {
            // Correct answer
            selectedButton.classList.remove('btn-outline-primary');
            selectedButton.classList.add('btn-success');
            correctFeedback.style.display = 'block';
            score++;
            updateScore();
        } else {
            // Incorrect answer
            selectedButton.classList.remove('btn-outline-primary');
            selectedButton.classList.add('btn-danger');
            
            // Highlight correct answer
            answerButtons.forEach(button => {
                if (button.dataset.answerId === correctAnswer.id) {
                    button.classList.remove('btn-outline-primary');
                    button.classList.add('btn-success');
                }
            });
            
            incorrectFeedback.style.display = 'block';
            correctAnswerSpan.textContent = `${correctAnswer.phonetic} (${correctAnswer.latin})`;
        }
    }
    
    // Move to next question
    function nextQuestion() {
        currentQuestion++;
        
        if (currentQuestion > totalQuestions) {
            // Quiz finished
            showFinalResults();
        } else {
            generateQuestion();
            updateProgress();
            questionCounter.textContent = `Question: ${currentQuestion}/${totalQuestions}`;
        }
    }
    
    // Show final quiz results
    function showFinalResults() {
        const mainSection = document.getElementById('main-section');
        mainSection.innerHTML = `
            <div class="quiz-results text-center">
                <h1>Quiz Completed!</h1>
                <div class="final-score mt-4 mb-4">
                    <h2>Your Score: ${score}/${totalQuestions}</h2>
                    <div class="progress mt-3">
                        <div class="progress-bar" role="progressbar" 
                             style="width: ${(score/totalQuestions)*100}%" 
                             aria-valuenow="${(score/totalQuestions)*100}" 
                             aria-valuemin="0" 
                             aria-valuemax="100">
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <h3>Performance: ${getPerformanceMessage(score, totalQuestions)}</h3>
                </div>
                <button id="restart-quiz" class="btn btn-primary btn-lg">
                    <i class="fa-solid fa-rotate-right me-2"></i> Restart Quiz
                </button>
                <a href="home.html" class="btn btn-secondary btn-lg ms-2">
                    <i class="fa-solid fa-home me-2"></i> Home
                </a>
            </div>
        `;
        
        // Add event listener for restart button
        document.getElementById('restart-quiz').addEventListener('click', function() {
            location.reload();
        });
    }
    
    // Get performance message based on score
    function getPerformanceMessage(score, total) {
        const percentage = (score / total) * 100;
        
        if (percentage >= 90) return "Excellent! You're a natural!";
        if (percentage >= 75) return "Great job!";
        if (percentage >= 60) return "Good work!";
        if (percentage >= 40) return "Keep practicing!";
        return "Don't worry, learning takes time!";
    }
    
    // Update progress bar
    function updateProgress() {
        const progress = ((currentQuestion - 1) / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Update score display
    function updateScore() {
        currentScoreDisplay.textContent = `Score: ${score}`;
    }
    
    // Helper function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Event listeners
    playButton.addEventListener('click', playSound);
    replayButton.addEventListener('click', playSound);
    
    answerButtons.forEach(button => {
        button.addEventListener('click', handleAnswer);
    });
    
    nextButton.addEventListener('click', nextQuestion);
    
    // Start the quiz
    initQuiz();
});

const easyModeButton = document.getElementById('easymode-button');
const hardModeButton = document.getElementById('hardmode-button');

easyModeButton.addEventListener('click', function() {
    window.location.href = 'listen.html'; // Redirect to beginner modes
});

hardModeButton.addEventListener('click', function() {
    window.location.href = 'evillisten.html'; // Redirect to expert mode
});