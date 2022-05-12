document.addEventListener("DOMContentLoaded", () => {
    createSquares();

    let guessedWords = [[]];
    let availableSpace = 1;

    const friends = ["celes","chris","hanna","angel","kaitl","glenn","allya","abbas","areeb","hasan","haris","antho","melvi","mahay","eslen"];
    let word = friends[Math.floor(Math.random()*friends.length)];
    let map = new Map();
    for (let char of word) {

        if (map.has(char)){
            map.set(char, map.get(char)+1);    
        }
        else {
            map.set(char, 1);
        }
    }
    let guessedWordCount = 0;

    const keys = document.querySelectorAll(".keyboard-row button");

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords-1]
    }
    function updateGuessedWords ( letter ) {
        const currentWordArr = getCurrentWordArr();

        if(currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            availableSpace = availableSpace + 1;

            availableSpaceEl.textContent = letter;
        }
    }

    function getTileColor(letter, index) {
        const isCorrectLetter = word.includes(letter);
        
        if (!isCorrectLetter) {
            return "rgb(58, 58, 60)";
        }
        let map = new Map();
        for (let char of word) {
        
            if (map.has(char)){
                map.set(char, map.get(char)+1);    
            }
            else {
                map.set(char, 1);
            }
        }
        const letterInThatPosition = word.charAt(index);
        const isCorrectPosition = letter === letterInThatPosition;
        if (isCorrectPosition) {
            map.set(letter, map.get(letter)-1);
            return "rgb(83, 141, 78)";
        }
        if (map.get(letter) > 0) {
            map.set(letter, map.get(letter)-1);
            return "rgb(181, 159, 59)";
        }
        return "rgb(58, 58, 60)";
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if (currentWordArr.length !== 5) {
            window.alert("word must be 5 letter durr");
            return;
        }
        
        const currentWord = currentWordArr.join('');
        console.log(word);
        console.log(map);

        const firstLetterId = guessedWordCount * 5 + 1;
        const interval = 200;
        currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
                const tileColor = getTileColor(letter, index);

                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.style = `background-color:${tileColor};border-color:${tileColor}`;
            }, interval * index);
        });

        guessedWordCount += 1;

        if (currentWord === word) {
            window.alert("good shit chiefo");
        }

        if (guessedWords.length === 6) {
            window.alert(`Sorry, bitch you loose hashabdhabdhwbdih, the word was ${word}.`);
        }

        guessedWords.push([]);
    }

    function handleDeleteLetter() {
        const currentWordArr = getCurrentWordArr();
        const removedLetter = currentWordArr.pop();

        guessedWords[guessedWords.length - 1] = currentWordArr;

        const lastLetterEl = document.getElementById(String(availableSpace-1));

        lastLetterEl.textContent = '';
        availableSpace = availableSpace - 1 ;
    }

    function createSquares() {
        const gameBoard = document.getElementById("board");

        for (let index = 0; index < 30; index++) {
            let square = document.createElement("div");
            square.classList.add("square");
            square.classList.add("animate__animated");
            square.setAttribute("id", index + 1);
            gameBoard.appendChild(square);
        }
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");

            if (letter === 'enter') {
                handleSubmitWord();
                return;
            }

            if (letter === 'del') {
                handleDeleteLetter();
                return;
            }

            updateGuessedWords(letter)
        }
    }
})