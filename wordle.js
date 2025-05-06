const words = [
    { word: "salam", meaning: "Peace", arabic: "سلام" },
    { word: "kitab", meaning: "Book", arabic: "كتاب" },
    { word: "qalam", meaning: "Pen", arabic: "قلم" },
    { word: "shams", meaning: "Sun", arabic: "شمس" },
    { word: "bahr", meaning: "Sea", arabic: "بحر" },
    { word: "jabal", meaning: "Mountain", arabic: "جبل" },
    { word: "sadiq", meaning: "Friend", arabic: "صديق" },
    { word: "najah", meaning: "Success", arabic: "نجاح" },
    { word: "madrasa", meaning: "School", arabic: "مدرسة" },
    { word: "hijab", meaning: "Veil", arabic: "حجاب" },
    { word: "wasat", meaning: "Middle", arabic: "وسط" },
    { word: "madina", meaning: "City", arabic: "مدينة" },
    { word: "safar", meaning: "Travel", arabic: "سفر" },
    { word: "haram", meaning: "Forbidden / Mosque", arabic: "حرام" },
    { word: "sharq", meaning: "East", arabic: "شرق" },
    { word: "ghurab", meaning: "Crow", arabic: "غراب" },
    { word: "qisas", meaning: "Stories", arabic: "قصص" },
    { word: "jamal", meaning: "Beauty / Camel", arabic: "جمال" },
    { word: "hayat", meaning: "Life", arabic: "حياة" },
    { word: "sukkar", meaning: "Sugar", arabic: "سكر" },
    { word: "thamar", meaning: "Fruit", arabic: "ثمر" },
    { word: "qiyam", meaning: "Standing / Prayer", arabic: "قيام" },
    { word: "sabir", meaning: "Patient", arabic: "صابر" },
    { word: "qamar", meaning: "Moon", arabic: "قمر" },
    { word: "dhahab", meaning: "Gold", arabic: "ذهب" },
    { word: "wakil", meaning: "Agent", arabic: "وكيل" },
  ];
  
  const maxAttempts = 6;
  let attempts;
  let randomWordObj;
  let randomWord;
  
  const wordleBoard = document.getElementById("wordle-board");
  const guessInput = document.getElementById("guess-input");
  const submitGuess = document.getElementById("submit-guess");
  const feedback = document.getElementById("feedback");
  
  function getCssVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  
  function initGame() {
    attempts = 0;
    randomWordObj = words[Math.floor(Math.random() * words.length)];
    randomWord = randomWordObj.word;
  
    wordleBoard.innerHTML = "";
    for (let i = 0; i < maxAttempts; i++) {
      const row = document.createElement("div");
      row.className = "wordle-row";
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement("span");
        cell.className = "wordle-cell";
        cell.style.backgroundColor = "";
        cell.style.color = "";
        cell.textContent = "";
        row.appendChild(cell);
      }
      wordleBoard.appendChild(row);
    }
  
    feedback.textContent = "";
    guessInput.value = "";
    guessInput.disabled = false;
    submitGuess.disabled = false;
    submitGuess.textContent = "Submit Guess";
  }
  
  function checkGuess(guess) {
    const row = wordleBoard.children[attempts];
    const cells = row.children;
  
    const correctColor = getCssVariable("--clr-correct");
    const presentColor = getCssVariable("--clr-present");
    const absentColor = getCssVariable("--clr-absent");
    const textColor = "white";
  
    for (let i = 0; i < guess.length; i++) {
      cells[i].textContent = guess[i];
      if (guess[i] === randomWord[i]) {
        cells[i].style.backgroundColor = correctColor;
        cells[i].style.color = textColor;
      } else if (randomWord.includes(guess[i])) {
        cells[i].style.backgroundColor = presentColor;
        cells[i].style.color = textColor;
      } else {
        cells[i].style.backgroundColor = absentColor;
        cells[i].style.color = textColor;
      }
    }
  }
  
  function showResult(won) {
    if (won) {
      feedback.innerHTML =
        `Congratulations! You guessed it!<br>
        <strong>Meaning:</strong> ${randomWordObj.meaning}<br>
        <strong>Arabic:</strong> ${randomWordObj.arabic}`;
      submitGuess.textContent = "New Game";
    } else {
      feedback.innerHTML =
        `Game Over! The word was: <strong>${randomWord}</strong><br>
        <strong>Meaning:</strong> ${randomWordObj.meaning}<br>
        <strong>Arabic:</strong> ${randomWordObj.arabic}`;
      submitGuess.textContent = "New Game";
    }
    guessInput.disabled = true;
    submitGuess.disabled = false;
  }
  
  submitGuess.addEventListener("click", function () {
    if (submitGuess.textContent === "New Game") {
      initGame();
      return;
    }
  
    const guess = guessInput.value.trim().toLowerCase();
    if (guess.length < 5 || guess.length > 7) {
      feedback.textContent = "Please enter a word between 5 and 7 letters.";
      return;
    }
    if (attempts < maxAttempts) {
      checkGuess(guess);
      attempts++;
    }
    if (guess === randomWord) {
      showResult(true);
    } else if (attempts >= maxAttempts) {
      showResult(false);
    }
  });
  
  initGame();