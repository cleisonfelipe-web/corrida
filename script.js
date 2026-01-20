const player = document.getElementById('player');
const board = document.getElementById('board');
const scoreElement = document.getElementById('score');

let pontos = 0;
let posX = 40; 
let velocidade = 5;
let jogoAtivo = true;
let pausado = false;

document.getElementById('pause-btn').onclick = () => {
    if (!jogoAtivo) return;
    pausado = !pausado;
    document.getElementById('pause-overlay').style.display = pausado ? 'flex' : 'none';
};

function mover(direcao) {
    if (!jogoAtivo || pausado) return;
    posX = (direcao === 'esquerda') ? 40 : 140;
    player.style.left = posX + 'px';
}

document.getElementById('left-btn').onclick = () => mover('esquerda');
document.getElementById('right-btn').onclick = () => mover('direita');
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mover('esquerda');
    if (e.key === 'ArrowRight') mover('direita');
});

document.getElementById('restart-btn').onclick = () => location.reload();

function gerarExplosao(x, y) {
    for (let i = 0; i < 12; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        p.style.setProperty('--dx', (Math.random() - 0.5) * 120 + "px");
        p.style.setProperty('--dy', (Math.random() - 0.5) * 120 + "px");
        p.style.left = x + "px"; p.style.top = y + "px";
        board.appendChild(p);
        setTimeout(() => p.remove(), 500);
    }
}

function criarObstaculo() {
    if (!jogoAtivo || pausado) return;
    const obs = document.createElement('div');
    obs.classList.add('obstacle');
    const laneX = Math.random() > 0.5 ? 40 : 140;
    obs.style.left = laneX + 'px';
    obs.style.top = '-40px';
    board.appendChild(obs);

    let posY = -40;
    let animacao = setInterval(() => {
        if (!jogoAtivo) { clearInterval(animacao); return; }
        if (pausado) return;
        posY += velocidade;
        obs.style.top = posY + 'px';

        if (posY > 310 && posY < 380 && laneX === posX) {
            jogoAtivo = false;
            board.classList.add('shake');
            gerarExplosao(posX + 10, posY + 15);
            
            let recorde = localStorage.getItem('highScore') || 0;
            if (pontos > recorde) { localStorage.setItem('highScore', pontos); recorde = pontos; }

            setTimeout(() => {
                document.getElementById('final-score').innerText = pontos;
                document.getElementById('high-score').innerText = recorde;
                document.getElementById('game-over-screen').style.display = 'flex';
            }, 600);
        }

        if (posY > 450) {
            clearInterval(animacao);
            obs.remove();
            pontos++;
            scoreElement.innerText = pontos;
            if (pontos % 5 === 0) velocidade += 0.8;
        }
    }, 20);
}

setInterval(criarObstaculo, 1500);
