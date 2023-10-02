const blockRows = document.querySelectorAll(".blocks-row");
let currentRow = 0;
const numberOfRows = blockRows.length;
const blocksPerRow = blockRows[0].querySelectorAll(".block").length;
let buffer = [];
let hasWon = null;

async function getWordOfTheDay() {
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resJson = await res.json();
  return resJson.word;
}

async function isWordValid(wordToCheck) {
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: wordToCheck }),
  });
  const resJson = await res.json();
  return resJson.validWord;
}

function writeLetter(letter) {
  buffer.length != blocksPerRow ? buffer.push(letter) : null;
}

function deleteLetter() {
  buffer.pop();
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function rerender() {
  if (currentRow >= numberOfRows) {
    hasWon = false;
  } else {
    let blocks = blockRows[currentRow].querySelectorAll(".block");
    for (let i = 0; i < blocks.length; i++) {
      blocks[i].innerText = buffer[i] ? buffer[i] : "";
    }
  }
}

async function saveWord(word) {
  let blocks = blockRows[currentRow].querySelectorAll(".block");
  if (await isWordValid(buffer.join(""))) {
    let wordCopy = word.slice();
    let score = 0;
    for (let i = 0; i < blocks.length; i++) {
      const letter = blocks[i].innerText.toLowerCase();
      blocks[i].style.color = "white";
      if (letter === word[i]) {
        blocks[i].style.backgroundColor = "green";
        score++;
        wordCopy =
          wordCopy.slice(0, i) + wordCopy.slice(i + 1, wordCopy.length);
      } else if (wordCopy.includes(letter)) {
        blocks[i].style.backgroundColor = "orange";
        letterIndex = wordCopy.indexOf(letter);
        wordCopy =
          wordCopy.slice(0, letterIndex) +
          wordCopy.slice(letterIndex + 1, wordCopy.length);
      } else {
        blocks[i].style.backgroundColor = "grey";
      }
    }
    buffer = [];
    currentRow++;
    if (score === blocksPerRow) {
      hasWon = true;
    }
  } else {
    blocks.forEach((b) => {
      b.style.border = "1px solid red";
    });

    setTimeout(() => {
      blocks.forEach((b) => {
        b.style.border = "";
      });
    }, 2000);
  }
}

async function init() {
  const word = await getWordOfTheDay();
  console.log(word);
  document.addEventListener("keyup", async function (event) {
    if (hasWon === null) {
      key = event.key;
      if (isLetter(key)) {
        writeLetter(key.toLowerCase());
      } else if (key === "Backspace") {
        deleteLetter();
      } else if (key === "Enter" && buffer.length == blocksPerRow) {
        await saveWord(word);
      } else {
        console.log("not letter", key);
      }
      rerender();
      if (hasWon === true) {
        alert("You Won!");
      } else if (hasWon === false) {
        alert(`You lost, the word was ${word.toUpperCase()}`);
      }
    }
  });
}

init();
