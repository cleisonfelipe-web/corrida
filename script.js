const player = document.getElementById('player');
const board = document.getElementById('board');
const scoreElement = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let pontos = 0;
let posX = 105;
let velocidade = 5;
let jogoAtivo = true;

// Movimento
function mover(direcao) {
    if (!jogoAtivo) return;
    if (direcao === 'esquerda' && posX > 45) posX -= 60;
    if (direcao === 'direita' && posX < 165) posX += 60;
    player.style.left = posX + 'px';
}

// Botões
document.getElementById('left-btn').onclick = () => mover('esquerda');
document.getElementById('right-btn').onclick = () => mover('direita');
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover('esquerda');
    if (e.key === 'ArrowRight') mover('direita');
});

restartBtn.onclick = () => location.reload();

function criarObstaculo() {
    if (!jogoAtivo) return;
    const obs = document.createElement('div');
    obs.classList.add('obstacle');
    const faixas = [45, 105, 165];
    let laneX = faixas[Math.floor(Math.random() * faixas.length)];
    obs.style.left = laneX + 'px';
    obs.style.top = '-40px';
    board.appendChild(obs);

    let posY = -40;
    let animacao = setInterval(() => {
        if (!jogoAtivo) { clearInterval(animacao); return; }
        posY += velocidade;
        obs.style.top = posY + 'px';

        // Colisão
        if (posY > 340 && posY < 390 && laneX === posX) {
            jogoAtivo = false;
            finalScoreElement.innerText = pontos;
            gameOverScreen.style.display = 'flex';
        }

        if (posY > 450) {
            clearInterval(animacao);
            obs.remove();
            pontos++;
            scoreElement.innerText = pontos;
            if (pontos % 5 === 0) velocidade += 1; // Aumenta velocidade
        }
    }, 20);
}

setInterval(criarObstaculo, 1500);