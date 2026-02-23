const boxes = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("reset-game");
const newBtn = document.getElementById("new-game");
const statsBtn = document.getElementById("stats-btn");
const winLine = document.getElementById("win-line");

let turnO = true;
let moves = 0;
let gameOver = false;


let stats = { played: 0, x: 0, o: 0, draw: 0 };

const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (box.textContent || gameOver) return;

    if (turnO) {
      box.textContent = "O";
      box.classList.add("o");
    } else {
      box.textContent = "X";
      box.classList.add("x");
    }

    box.disabled = true;
    turnO = !turnO;
    moves++;

    checkWinner();
  });
});


function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;

    if (
      boxes[a].textContent &&
      boxes[a].textContent === boxes[b].textContent &&
      boxes[a].textContent === boxes[c].textContent
    ) {
      gameOver = true;


      stats.played++;
      if (boxes[a].textContent === "X") {
        stats.x++;
      } else {
        stats.o++;
      }

      drawWinLine(a, c);
      boxes.forEach(box => box.disabled = true);
      return;
    }
  }


  if (moves === 9 && !gameOver) {
    gameOver = true;
    stats.played++;
    stats.draw++;
    boxes.forEach(box => box.disabled = true);
  }
}




function resetBoard() {
  boxes.forEach(box => {
    box.textContent = "";
    box.classList.remove("x", "o");
    box.disabled = false;
  });

  winLine.style.display = "none";
  winLine.getAnimations().forEach(anim => anim.cancel());

  turnO = true;
  moves = 0;
  gameOver = false;
}

function drawWinLine(startIndex, endIndex) {
  const board = document.querySelector(".board-wrapper");
  const boardRect = board.getBoundingClientRect();

  const startCell = boxes[startIndex].getBoundingClientRect();
  const endCell = boxes[endIndex].getBoundingClientRect();

 
  const x1 = startCell.left + startCell.width / 2 - boardRect.left;
  const y1 = startCell.top + startCell.height / 2 - boardRect.top;
  const x2 = endCell.left + endCell.width / 2 - boardRect.left;
  const y2 = endCell.top + endCell.height / 2 - boardRect.top;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  winLine.style.display = "block";
  winLine.style.width = "0px";
  winLine.style.left = `${x1}px`;
  winLine.style.top = `${y1}px`;
  winLine.style.transformOrigin = "left center";
  winLine.style.transform = `rotate(${angle}deg)`;

  requestAnimationFrame(() => {
    winLine.style.width = `${length}px`;
  });
}


resetBtn.onclick = resetBoard;

newBtn.onclick = () => {
  stats = { played: 0, x: 0, o: 0, draw: 0 };
  resetBoard();
};


statsBtn.onclick = () => {
  document.getElementById("stats-modal").classList.remove("hidden");
  document.getElementById("played").textContent = `Games Played: ${stats.played}`;
  document.getElementById("xwins").textContent = `X Wins: ${stats.x}`;
  document.getElementById("owins").textContent = `O Wins: ${stats.o}`;
  document.getElementById("draws").textContent = `Draws: ${stats.draw}`;
};


function closeStats() {
  document.getElementById("stats-modal").classList.add("hidden");
}
