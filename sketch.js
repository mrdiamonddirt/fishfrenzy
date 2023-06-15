// Fish Frenzy game
let fish = {
  x: 0,
  y: 200,
  size: 20,
  speed: 5,
  speedY: 0,
  display: function() {
    // Draw fish body
    // fishImg.resize(this.size, (this.size * fishImg.height) / fishImg.width);
    // image(fishImg, this.x, this.y);
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.size);
    if (fish.speed > 0) {
      // Draw fish facing right
      // Draw fish tail
      fill(0);
      triangle(
        this.x - this.size / 2,
        this.y,
        this.x - this.size,
        this.y - this.size / 2,
        this.x - this.size,
        this.y + this.size / 2
      );
      // Draw fish eye
      fill(255);
      ellipse(this.x + this.size / 4, this.y, this.size / 2);
    } else {
      // Draw fish facing left
      // Draw fish tail
      fill(0);
      triangle(
        this.x + this.size / 2,
        this.y,
        this.x + this.size,
        this.y - this.size / 2,
        this.x + this.size,
        this.y + this.size / 2
      );
      // Draw fish eye
      fill(255);
      ellipse(this.x - this.size / 4, this.y, this.size / 2);
    }
  },
  move: function() {
    this.x += this.speed;
    if (this.x > width) {
      this.x = 0;
    }
    this.y += this.speedY;

    // Limit fish movement within canvas bounds
    this.y = constrain(this.y, 0, height);
  },
};

let enemies = [];
let bubbles = [];
let score = 0;
let lives = 3;
let gameState = "start";
let timer = 0;

// load sprites
let fishImg;
let enemyImg;

function preload() {
  fishImg = loadImage("assets/shark.png");
  enemyImg = loadImage("assets/orca.png");
}

function setup() {
  createCanvas(800, 400);
}

function draw() {
  background(220);

  if (gameState === "start") {
    startGame();
  } else if (gameState === "play") {
    playGame();
  } else if (gameState === "end") {
    gameOver();
  }
}

function startGame() {
  background(0);
  fill(255);
  textSize(20);
  text("Fish Frenzy", width / 2 - 50, height / 2);
  text("Click to Start", width / 2 -50, height / 2 + 20);
}

function mousePressed() {
  if (gameState === "start") {
    startPlaying();
  } else if (gameState === "end") {
    restartGame();
  }
}

function startPlaying() {
  gameState = "play";
}

function playGame() {
  handleTimer();
  handleFish();
  handleBubbles();
  handleCollision();
  handleCreateEnemy();
}

function gameOver() {
  background(0);
  fill(255);
  textSize(20);
  text("Game Over", width / 2 - 50, height / 2);
  text("Final Score: " + score, width / 2 -50, height / 2 + 20);
  text("Click to Restart", width / 2 - 50, height / 2 + 40);
}

function restartGame() {
  gameState = "start";
  score = 0;
  lives = 3;
  timer = 0;
  fish.size = 20;
  enemies = [];
  bubbles = [];
}

function handleTimer() {
  if (frameCount % 60 === 0) {
    timer++;
  }
  text("Timer: " + timer, 20, 20);
}

function handleFish() {
  fish.move();
  fish.display();
}

function handleCollision() {
  for (let i = 0; i < bubbles.length; i++) {
    let bubble = bubbles[i];
    let d = dist(fish.x, fish.y, bubble.x, bubble.y);
    if (d < fish.size / 2 + bubble.size / 2) {
      score++;
      bubbles.splice(i, 1);
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    let d = dist(fish.x, fish.y, enemy.x, enemy.y);
    if (d < fish.size / 2 + enemy.size / 2) {
      if (enemy.size < fish.size) {
        score++;
        fish.size += 5;
        enemies.splice(i, 1);
      } else {
        lives--;
        fish.size -= 5;
        enemies.splice(i, 1);
      }
    }
  }
  text("Score: " + score, 20, 40);

  if (lives <= 0) {
    gameState = "end";
  }
}

function handleBubbles() {
  if (frameCount % 60 === 0) {
    let bubble = {
      x: random(width),
      y: random(height),
      size: random(10, 30),
      speed: random(1, 3),
    };
    bubbles.push(bubble);
  }

  for (let i = 0; i < bubbles.length; i++) {
    let bubble = bubbles[i];
    bubble.y -= bubble.speed;

    fill(0, 255, 255);
    ellipse(bubble.x, bubble.y, bubble.size);

    if (bubble.y < -bubble.size) {
      bubbles.splice(i, 1);
      i--;
    }
  }
}

function handleCreateEnemy() {
  if (frameCount % 30 === 0) {
    let enemy = {
      x: random([0, width]), // Generate random x position within canvas width
      y: random(height),
      // base the size of the enemy on the fish size + or - 50%

      size: random(fish.size * 0.5, fish.size * 1.5),
      speed: random(1, 3),
      direction: random([-1, 1]) // -1 for moving left, 1 for moving right
    };
    enemies.push(enemy);
  }

  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];

    // Update the enemy's x position based on its direction and speed
    enemy.x += enemy.speed * enemy.direction;

    fill(0, 0, 255);
    ellipse(enemy.x, enemy.y, enemy.size);

    if (enemy.direction === -1) {
      // draw enemy facing left
      // draw tail
      fill(0);
      triangle(
        enemy.x + enemy.size / 2,
        enemy.y,
        enemy.x + enemy.size,
        enemy.y - enemy.size / 2,
        enemy.x + enemy.size,
        enemy.y + enemy.size / 2
      );
      // draw eye
      fill(255);
      ellipse(enemy.x - enemy.size / 4, enemy.y, enemy.size / 2);
    } else {
      fill(0);
      triangle(
        enemy.x - enemy.size / 2,
        enemy.y,
        enemy.x - enemy.size,
        enemy.y - enemy.size / 2,
        enemy.x - enemy.size,
        enemy.y + enemy.size / 2
      );
      // draw eye
      fill(255);
      ellipse(enemy.x + enemy.size / 4, enemy.y, enemy.size / 2);
    }
    // Draw enemy image
    // enemyImg.resize(enemy.size, (enemy.size * 2));
    // image(enemyImg, enemy.x, enemy.y);
    // Check if the enemy is off-screen, and remove it from the array if so
    if (enemy.x < -enemy.size || enemy.x > width + enemy.size) {
      enemies.splice(i, 1);
      i--;
    }
  }
}


// Controls
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    fish.speed = -5;
  } else if (keyCode === RIGHT_ARROW) {
    fish.speed = 5;
  } else if (keyCode === UP_ARROW) {
    fish.speedY = -5;
  } else if (keyCode === DOWN_ARROW) {
    fish.speedY = 5;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    fish.speed = 0;
  }
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    fish.speedY = 0;
  }
}
