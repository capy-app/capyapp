document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('writing-pad');
    const ctx = canvas.getContext('2d');

    // Canvas setup
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const checkAndNewCharacterBtn = document.getElementById('checkAndNewCharacter');
    const undoStrokeBtn = document.getElementById('undoStroke');
    const playSoundBtn = document.getElementById('playSound'); // Play sound button
    const characterSpan = document.getElementById('character');
    const romanizationSpan = document.getElementById('romanization'); // New element for Romanization
    const scoreSpan = document.getElementById('score');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentCharacter = '';
    let score = 0;
    let userPath = [];
    let templatePath = [];
    let TRACE_TOLERANCE = 20; // Pixel distance tolerance for tracing
    let strokeHistory = []; // Array to store strokes for undo functionality
    let currentStroke = []; // Current stroke points
    let checkingInProgress = false; // Flag to prevent multiple checks at once

    // Updated character set to include Arabic words with Romanizations
    const characters = [
        { arabic: "Pamahalaan", romanization: "Government" },
        { arabic: "Kalakalan", romanization: "Commerce" },
        { arabic: "Sining", romanization: "Art" },
        { arabic: "Panitikan", romanization: "Literature" },
        { arabic: "Pamana", romanization: "Heritage" },
        { arabic: "Pangangatwiran", romanization: "Reasoning" },
        { arabic: "Pagpapahusay", romanization: "Improvement" },
        { arabic: "Pagkakakilanlan", romanization: "Identity" },
        { arabic: "Pagsusuri", romanization: "Analysis" },
        { arabic: "Pagbabago", romanization: "Change" },
        { arabic: "Pagkakaiba", romanization: "Difference" },
        { arabic: "Pagtutulungan", romanization: "Collaboration" },
        { arabic: "Pagpapasya", romanization: "Decision" },
        { arabic: "Pangangalaga", romanization: "Preservation" },
        { arabic: "Pag-unlad", romanization: "Development" },
        { arabic: "Pagiging tunay", romanization: "Authenticity" },
        { arabic: "Pagkamalikhain", romanization: "Creativity" },
        { arabic: "Pagtitiwala", romanization: "Trust" },
        { arabic: "Pagkakapantay-pantay", romanization: "Equality" },
        { arabic: "Pagkamabisa", romanization: "Effectiveness" },
        { arabic: "Pagtitiis", romanization: "Perseverance" },
    ];

    function drawTemplateCharacter() {
        ctx.save();

        // Calculate optimal font size to fit the canvas based on word length
        let fontSize = 150; // Start with default size
        const maxWidth = canvas.width * 0.9; // Use 90% of canvas width
        const maxHeight = canvas.height * 0.7; // Use 70% of canvas height
        
        // Adaptive font sizing algorithm
        ctx.font = `${fontSize}px Fredoka`;
        let metrics = ctx.measureText(currentCharacter);
        
        // Keep reducing font size until the text fits width
        while (metrics.width > maxWidth && fontSize > 20) {
            fontSize -= 5;
            ctx.font = `${fontSize}px Fredoka`;
            metrics = ctx.measureText(currentCharacter);
        }
        
        // Further reduce if we suspect it might be too tall
        // (approximating height based on character length and font size)
        const estimatedHeight = fontSize * 1.2;
        if (estimatedHeight > maxHeight || currentCharacter.length > 10) {
            fontSize = Math.min(fontSize, maxHeight / 1.2);
            ctx.font = `${fontSize}px Fredoka`;
            metrics = ctx.measureText(currentCharacter);
        }
        
        ctx.fillStyle = '#cccccc';
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;

        // Get character metrics for centering
        const width = metrics.width;
        // Use fontSize as height approximation since actualBoundingBox might not be supported in all browsers
        const height = metrics.actualBoundingBoxAscent && metrics.actualBoundingBoxDescent ? 
                      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent : 
                      fontSize * 0.7;

        // Calculate position to center the character
        const x = (canvas.width - width) / 2;
        const y = (canvas.height + height) / 2;

        // Draw the character
        ctx.fillText(currentCharacter, x, y);

        // Store the character path for verification
        templatePath = getCharacterPath();

        // Adjust trace tolerance based on character complexity
        adjustTraceTolerance();

        ctx.restore();
    }

    // Also update the display area text size
    // Update the display area text size to fit within the container
    function updateDisplayTextSize() {
        const characterDisplay = document.getElementById('character');
        const romanizationDisplay = document.getElementById('romanization');
        const infoArea = document.getElementById('info-area');
        
        // Get info area width to determine maximum text size
        const containerWidth = infoArea.clientWidth - 40; // Subtract padding
        
        // Adjust display text size based on word length
        if (currentCharacter.length > 15) {
            characterDisplay.style.fontSize = '1.5rem'; // Extra small for very long words
            romanizationDisplay.style.fontSize = '1.5rem';
        } else if (currentCharacter.length > 12) {
            characterDisplay.style.fontSize = '1.8rem'; // Very small for very long words
            romanizationDisplay.style.fontSize = '1.8rem';
        } else if (currentCharacter.length > 8) {
            characterDisplay.style.fontSize = '2.2rem'; // Smaller for long words
            romanizationDisplay.style.fontSize = '2.2rem';
        } else if (currentCharacter.length > 5) {
            characterDisplay.style.fontSize = '2.8rem'; // Medium for medium-length words
            romanizationDisplay.style.fontSize = '2.8rem';
        } else {
            characterDisplay.style.fontSize = '3.5rem'; // Default size for short words
            romanizationDisplay.style.fontSize = '3.5rem';
        }
        
        // Additional check to ensure text fits in container
        // Wait for browser to apply fontSize changes before measuring
        setTimeout(() => {
            const characterWidth = characterDisplay.scrollWidth;
            const romanizationWidth = romanizationDisplay.scrollWidth;
            const maxWidth = Math.max(characterWidth, romanizationWidth);
            
            // If text is still too wide, further reduce font size
            if (maxWidth > containerWidth) {
                const scaleFactor = containerWidth / maxWidth * 0.95; // 5% margin
                const newCharSize = parseFloat(window.getComputedStyle(characterDisplay).fontSize) * scaleFactor;
                const newRomSize = parseFloat(window.getComputedStyle(romanizationDisplay).fontSize) * scaleFactor;
                
                characterDisplay.style.fontSize = `${newCharSize}px`;
                romanizationDisplay.style.fontSize = `${newRomSize}px`;
            }
        }, 0);
    }

    function adjustTraceTolerance() {
        // Set base tolerance depending on script type
        if (currentCharacter.match(/[أ-ي]/)) {
            TRACE_TOLERANCE = 25;
        } else if (currentCharacter.match(/[A-Z]/)) {
            TRACE_TOLERANCE = 18;
        } else {
            TRACE_TOLERANCE = 20;
        }

        // Adjust based on character length/word complexity
        if (currentCharacter.length > 2) {
            TRACE_TOLERANCE += 10; // More forgiving for longer words
        }

        const metrics = ctx.measureText(currentCharacter);
        const charWidth = metrics.width;

        if (charWidth > 100) {
            TRACE_TOLERANCE += 5;
        } else if (charWidth < 50) {
            TRACE_TOLERANCE -= 3;
        }

        TRACE_TOLERANCE = Math.max(15, Math.min(40, TRACE_TOLERANCE));
    }

    function getCharacterPath() {
        const path = [];
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        for (let py = 0; py < canvas.height; py++) {
            for (let px = 0; px < canvas.width; px++) {
                const i = (py * canvas.width + px) * 4;
                if (imageData[i] < 255 || imageData[i + 1] < 255 || imageData[i + 2] < 255) {
                    path.push({x: px, y: py});
                }
            }
        }

        return path;
    }

    function startDrawing(e) {
        isDrawing = true;
        currentStroke = [];

        const [x, y] = getCoordinates(e);
        lastX = x;
        lastY = y;

        currentStroke.push({x, y});
        userPath.push({x, y});

        drawDot(x, y);
    }

    function drawDot(x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();

        const [x, y] = getCoordinates(e);

        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();

        currentStroke.push({x, y});
        userPath.push({x, y});

        [lastX, lastY] = [x, y];
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            if (currentStroke.length > 0) {
                strokeHistory.push([...currentStroke]);
            }
        }
    }

    function undoLastStroke() {
        if (strokeHistory.length > 0) {
            const lastStroke = strokeHistory.pop();

            userPath = userPath.filter(point => 
                !lastStroke.some(strokePoint => 
                    strokePoint.x === point.x && strokePoint.y === point.y
                )
            );

            redrawCanvas();
        }
    }

    function redrawCanvas() {
        clearCanvas();
        drawTemplateCharacter();

        ctx.save();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;

        for (const stroke of strokeHistory) {
            if (stroke.length > 0) {
                ctx.beginPath();
                ctx.moveTo(stroke[0].x, stroke[0].y);

                for (let i = 1; i < stroke.length; i++) {
                    ctx.lineTo(stroke[i].x, stroke[i].y);
                }

                ctx.stroke();
            }
        }

        ctx.restore();
    }

    function checkAndNewCharacter() {
        if (checkingInProgress) return;
        checkingInProgress = true;

        if (userPath.length === 0) {
            scoreSpan.textContent = 'Please trace the character';
            checkingInProgress = false;
            return;
        }

        const templateCoverage = calculateTemplateCoverage();
        const userAccuracy = calculateUserAccuracy(); // Fixed function name

        const finalScore = (templateCoverage * 0.6) + (userAccuracy * 0.4);

        if (finalScore >= 70) {
            score++;
            scoreSpan.textContent = `Pass! (${Math.round(finalScore)}%)`;

            setTimeout(() => {
                setNewCharacter();
                checkingInProgress = false;
            }, 1000);
        } else {
            score = 0;
            scoreSpan.textContent = `Try Again (${Math.round(finalScore)}%)`;
            checkingInProgress = false;
        }
    }

    function calculateTemplateCoverage() {
        let coveredPoints = 0;
        const sampledTemplate = samplePath(templatePath, 100);

        for (const templatePoint of sampledTemplate) {
            const isCovered = userPath.some(userPoint => {
                const distance = Math.sqrt(
                    Math.pow(userPoint.x - templatePoint.x, 2) + 
                    Math.pow(userPoint.y - templatePoint.y, 2)
                );
                return distance <= TRACE_TOLERANCE;
            });

            if (isCovered) coveredPoints++;
        }

        return (coveredPoints / sampledTemplate.length) * 100;
    }

    function calculateUserAccuracy() { // Fixed function name
        let pointsOnPath = 0;

        for (const userPoint of userPath) {
            const isOnPath = templatePath.some(templatePoint => {
                const distance = Math.sqrt(
                    Math.pow(userPoint.x - templatePoint.x, 2) + 
                    Math.pow(userPoint.y - templatePoint.y, 2)
                );
                return distance <= TRACE_TOLERANCE;
            });

            if (isOnPath) pointsOnPath++;
        }

        return (pointsOnPath / userPath.length) * 100;
    }

    function samplePath(path, sampleSize) {
        if (path.length <= sampleSize) return path;

        const result = [];
        const step = path.length / sampleSize;

        for (let i = 0; i < sampleSize; i++) {
            const index = Math.floor(i * step);
            result.push(path[index]);
        }

        return result;
    }

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.type.includes('mouse')) {
            return [
                (e.clientX - rect.left) * scaleX,
                (e.clientY - rect.top) * scaleY
            ];
        } else if (e.type.includes('touch')) {
            return [
                (e.touches[0].clientX - rect.left) * scaleX,
                (e.touches[0].clientY - rect.top) * scaleY
            ];
        }
    }

    function getRandomCharacter() {
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    }

    function setNewCharacter() {
        clearCanvas();
        const currentCharacterData = getRandomCharacter();
        currentCharacter = currentCharacterData.arabic;
        characterSpan.textContent = currentCharacter;
        romanizationSpan.textContent = currentCharacterData.romanization; // Display the romanization
        
        // Update text size for display area
        updateDisplayTextSize();
        
        // Call it again after a short delay to ensure accurate measurements
        setTimeout(updateDisplayTextSize, 50);
        
        drawTemplateCharacter();
        userPath = [];
        strokeHistory = [];
        scoreSpan.textContent = score;
    }


    function clearCanvas() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function toggleCharacterDisplay() {
        const displayCharacter = document.getElementById('character');
        const displayRomanization = document.getElementById('romanization');

        if (displayCharacter.style.display === 'none') {
            displayCharacter.textContent = currentCharacter;
            displayCharacter.style.display = 'block';
            displayRomanization.style.display = 'none';
        } else {
            displayRomanization.textContent = characters.find(c => c.arabic === currentCharacter).romanization;
            displayRomanization.style.display = 'block';
            displayCharacter.style.display = 'none';
        }
        
        // Update text size when toggling display
        updateDisplayTextSize();
        
        // Call it again after a short delay to ensure accurate measurements
        setTimeout(updateDisplayTextSize, 50);
    }
    
    // Map Arabic words to sound file names (relative URLs or paths)
    const characterSounds = {
        'أب': 'sounds/alif.mp3',
        'أم': 'sounds/alif.mp3',
        'بيت': 'sounds/alif.mp3',
        'كتاب': 'sounds/alif.mp3',
        'قلم': 'sounds/alif.mp3',
        'ماء': 'sounds/alif.mp3',
        'شمس': 'sounds/alif.mp3',
        'قمر': 'sounds/alif.mp3',
        'نجمة': 'sounds/alif.mp3',
        'شجرة': 'sounds/alif.mp3',
        'طعام': 'sounds/alif.mp3',
        'خبز': 'sounds/alif.mp3',
        'فواكه': 'sounds/alif.mp3',
        'حليب': 'sounds/alif.mp3',
        'دجاج': 'sounds/alif.mp3',
        'سمك': 'sounds/alif.mp3',
        'سيارة': 'sounds/alif.mp3',
        'مدرسة': 'sounds/alif.mp3',
        'صديق': 'sounds/alif.mp3',
        'لعبة': 'sounds/alif.mp3'
    };
    function playCharacterSound() {
        const soundFile = characterSounds[currentCharacter];
        if (soundFile) {
            const audio = new Audio(soundFile);
            audio.play();
        } else {
            console.log('Sound not found for this word');
            // Use a generic fallback sound or synthesized speech if available
        }
    }

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);
    checkAndNewCharacterBtn.addEventListener('click', checkAndNewCharacter);
    undoStrokeBtn.addEventListener('click', undoLastStroke);
    document.getElementById('toggleCharacter').addEventListener('click', toggleCharacterDisplay);
    playSoundBtn.addEventListener('click', playCharacterSound); // Play sound on button click

    // Initialize
    clearCanvas();
    setNewCharacter();
});
const easyModeButton = document.getElementById('easymode-button');
const hardModeButton = document.getElementById('hardmode-button');

easyModeButton.addEventListener('click', function() {
    window.location.href = 'write.html'; // Redirect to beginner mode
});

hardModeButton.addEventListener('click', function() {
    window.location.href = 'evilwrite.html'; // Redirect to expert mode
});