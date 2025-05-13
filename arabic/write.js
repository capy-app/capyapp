//this is also 70% ai atp
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

    // Updated character set to include Romanizations
    const characters = [
        { arabic: 'أ', romanization: 'Alif' },
        { arabic: 'ب', romanization: 'Ba' },
        { arabic: 'ت', romanization: 'Ta' },
        { arabic: 'ث', romanization: 'Tha' },
        { arabic: 'ج', romanization: 'Jim' },
        { arabic: 'ح', romanization: 'Ha' },
        { arabic: 'خ', romanization: 'Kha' },
        { arabic: 'د', romanization: 'Dal' },
        { arabic: 'ذ', romanization: 'Dhal' },
        { arabic: 'ر', romanization: 'Ra' },
        { arabic: 'ز', romanization: 'Zay' },
        { arabic: 'س', romanization: 'Sin' },
        { arabic: 'ش', romanization: 'Shin' },
        { arabic: 'ص', romanization: 'Sad' },
        { arabic: 'ض', romanization: 'Dad' },
        { arabic: 'ط', romanization: 'Ta (emphatic)' },
        { arabic: 'ظ', romanization: 'Dha (emphatic)' },
        { arabic: 'ع', romanization: 'Ayn' },
        { arabic: 'غ', romanization: 'Ghayn' },
        { arabic: 'ف', romanization: 'Fa' },
        { arabic: 'ق', romanization: 'Qaf' },
        { arabic: 'ك', romanization: 'Kaf' },
        { arabic: 'ل', romanization: 'Lam' },
        { arabic: 'م', romanization: 'Mim' },
        { arabic: 'ن', romanization: 'Nun' },
        { arabic: 'ه', romanization: 'Ha (final)' },
        { arabic: 'و', romanization: 'Waw' },
        { arabic: 'ي', romanization: 'Ya' }
    ];

    function drawTemplateCharacter() {
        ctx.save();

        // Adjust font size based on character height
        let fontSize = 150;
        if (currentCharacter.toUpperCase() === currentCharacter) {
            fontSize = 130; // Slightly smaller for capital letters to maintain consistent visual size
        }

        ctx.font = `${fontSize}px Fredoka`;
        ctx.fillStyle = '#cccccc';
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;

        // Get character metrics for centering
        const metrics = ctx.measureText(currentCharacter);
        const width = metrics.width;
        const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

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

    function adjustTraceTolerance() {
        if (currentCharacter.match(/[أ-ي]/)) {
            TRACE_TOLERANCE = 25;
        } else if (currentCharacter.match(/[A-Z]/)) {
            TRACE_TOLERANCE = 18;
        } else {
            TRACE_TOLERANCE = 20;
        }

        const metrics = ctx.measureText(currentCharacter);
        const charWidth = metrics.width;

        if (charWidth > 100) {
            TRACE_TOLERANCE += 5;
        } else if (charWidth < 50) {
            TRACE_TOLERANCE -= 3;
        }

        TRACE_TOLERANCE = Math.max(15, Math.min(30, TRACE_TOLERANCE));
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
        const userAccuracy = calculateUserAccuracy();

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

    function calculateUserAccuracy() {
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
        romanizationSpan.textContent = currentCharacterData.romanization;
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
    }
    
    // Map Arabic characters to sound file names (relative URLs or paths)
    const characterSounds = {
        'أ': 'sounds/alif.mp3',
        'ب': 'sounds/ba.mp3',
        'ت': 'sounds/ta.mp3',
        'ث': 'sounds/tha.mp3',
        'ج': 'sounds/jim.mp3',
        'ح': 'sounds/ha.mp3',
        'خ': 'sounds/kha.mp3',
        'د': 'sounds/dal.mp3',
        'ذ': 'sounds/dhal.mp3',
        'ر': 'sounds/ra.mp3',
        'ز': 'sounds/zay.mp3',
        'س': 'sounds/sin.mp3',
        'ش': 'sounds/shin.mp3',
        'ص': 'sounds/sad.mp3',
        'ض': 'sounds/dad.mp3',
        'ط': 'sounds/ta_emphatic.mp3',
        'ظ': 'sounds/dha_emphatic.mp3',
        'ع': 'sounds/ayn.mp3',
        'غ': 'sounds/ghayn.mp3',
        'ف': 'sounds/fa.mp3',
        'ق': 'sounds/qaf.mp3',
        'ك': 'sounds/kaf.mp3',
        'ل': 'sounds/lam.mp3',
        'م': 'sounds/mim.mp3',
        'ن': 'sounds/nun.mp3',
        'ه': 'sounds/ha_final.mp3',
        'و': 'sounds/waw.mp3',
        'ي': 'sounds/ya.mp3'
    };

    function playCharacterSound() {
        const soundFile = characterSounds[currentCharacter];
        if (soundFile) {
            const audio = new Audio(soundFile);
            audio.play();
        } else {
            alert('Sound not found for this character');
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