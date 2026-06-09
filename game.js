const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 960;
canvas.height = 540;

const gravity = 0.6;
let score = 0;

const player = {
  x: 100,
  y: 100,
  w: 40,
  h: 40,
  vx: 0,
  vy: 0,
  speed: 5,
  jump: -12,
  grounded: false
};

const keys = {};

const platforms = [
  {x: 0, y: 500, w: 960, h: 40},
  {x: 200, y: 420, w: 140, h: 20},
  {x: 420, y: 350, w: 140, h: 20},
  {x: 650, y: 280, w: 140, h: 20},
  {x: 500, y: 180, w: 120, h: 20}
];

const coins = [
  {x: 250, y: 380, size: 20, collected: false},
  {x: 470, y: 310, size: 20, collected: false},
  {x: 700, y: 240, size: 20, collected: false},
  {x: 540, y: 140, size: 20, collected: false}
];

const enemy = {
  x: 700,
  y: 460,
  w: 40,
  h: 40,
  dir: 1,
  speed: 2
};

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function collide(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function update() {

  // Movimento
  if (keys["ArrowRight"] || keys["d"]) {
    player.vx = player.speed;
  } else if (keys["ArrowLeft"] || keys["a"]) {
    player.vx = -player.speed;
  } else {
    player.vx = 0;
  }

  // Pulo
  if ((keys[" "] || keys["ArrowUp"] || keys["w"]) && player.grounded) {
    player.vy = player.jump;
    player.grounded = false;
  }

  // Gravidade
  player.vy += gravity;

  player.x += player.vx;
  player.y += player.vy;

  player.grounded = false;

  // Plataformas
  for (const p of platforms) {

    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y + player.h < p.y + 20 &&
      player.y + player.h + player.vy >= p.y
    ) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;
    }
  }

  // Inimigo
  enemy.x += enemy.speed * enemy.dir;

  if (enemy.x < 600 || enemy.x > 860) {
    enemy.dir *= -1;
  }

  // Colisão inimigo
  if (collide(player, enemy)) {
    resetGame();
  }

  // Moedas
  for (const coin of coins) {
    if (!coin.collected &&
        player.x < coin.x + coin.size &&
        player.x + player.w > coin.x &&
        player.y < coin.y + coin.size &&
        player.y + player.h > coin.y) {

      coin.collected = true;
      score++;

      document.getElementById("score").textContent =
        "Moedas: " + score;
    }
  }

  // Cair do mapa
  if (player.y > canvas.height + 200) {
    resetGame();
  }

  // Vitória
  if (score === coins.length) {
    alert("Você venceu!");
    resetGame(true);
  }
}

function resetGame(win = false) {

  player.x = 100;
  player.y = 100;
  player.vx = 0;
  player.vy = 0;

  if (win) {
    score = 0;

    for (const coin of coins) {
      coin.collected = false;
    }

    document.getElementById("score").textContent =
      "Moedas: 0";
  }
}

function draw() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Plataformas
  ctx.fillStyle = "#228B22";

  for (const p of platforms) {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  // Player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // Enemy
  ctx.fillStyle = "purple";
  ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

  // Coins
  ctx.fillStyle = "gold";

  for (const coin of coins) {
    if (!coin.collected) {
      ctx.beginPath();
      ctx.arc(
        coin.x + coin.size / 2,
        coin.y + coin.size / 2,
        coin.size / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
