// Seleciona os elementos de áudio para pulo, colisão e música de fundo
const jumpSound = document.getElementById('jump-sound');
const gameoverSound = document.getElementById('gameover-sound');
const bgmSound = document.getElementById('bgm-sound');


// Define o volume do som de pulo (0.0 a 1.0)
if (jumpSound) jumpSound.volume = 0.4;
// Define o volume do som de game over
if (gameoverSound) gameoverSound.volume = 0.8;
// Define o volume da música de fundo
if (bgmSound) bgmSound.volume = 1.0;

// Toca a música de fundo automaticamente ao iniciar o jogo
if (bgmSound) {
    // Tentar tocar após interação do usuário (requerido por navegadores)
    const playBGM = () => {
        bgmSound.play();
        document.removeEventListener('keydown', playBGM);
        document.removeEventListener('click', playBGM);
    };
    document.addEventListener('keydown', playBGM);
    document.addEventListener('click', playBGM);
}

// Define o volume do som de pulo (0.0 a 1.0)
if (jumpSound) jumpSound.volume = 0.4;
// Seleciona o elemento do Mario
const mario = document.querySelector(".mario");
// Seleciona o elemento do cano (pipe)
const pipe = document.querySelector(".pipe");
// Seleciona o elemento das nuvens
const clouds = document.querySelector('.clouds');
// Seleciona o botão de reiniciar
const restartBtn = document.getElementById('restart-btn');
// Seleciona os elementos do contador de pulos e highscore
const jumpCounterSpan = document.getElementById('jump-counter');
const highscoreSpan = document.getElementById('highscore');

// Inicializa variáveis de contagem
let jumpCount = 0;
let highscore = Number(localStorage.getItem('marioHighscore')) || 0;
highscoreSpan.textContent = `Recorde: ${highscore}`;


// Controle para evitar múltiplos pulos ao segurar a tecla e impedir pulos após o game over
let isJumping = false;
let isGameOver = false;
let jumpKeyPressed = false;

const jump = (event) => {
    // Só permite pular se não estiver pulando, não for game over e a tecla não estiver pressionada
    if (isJumping || isGameOver || jumpKeyPressed) return;
    isJumping = true;
    jumpKeyPressed = true;
    mario.classList.add("jump"); // Adiciona a classe de animação de pulo
    jumpCount++;
    jumpCounterSpan.textContent = `Pulos: ${jumpCount}`;
    // Toca o som de pulo
    if (jumpSound) {
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
    setTimeout(() => {
        mario.classList.remove("jump"); // Remove a animação após 500ms
        isJumping = false;
    }, 500);
}

// Loop principal do jogo, verifica colisão a cada 10ms
const loop = setInterval(() => {
    // Pega a posição atual do cano (pipe) em relação à esquerda da tela
    const pipePosition = pipe.offsetLeft;
    // Pega a posição do Mario em relação à base da tela
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    
    // Calcula largura real do Mario e do pipe para colisão precisa
    const marioRect = mario.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();
    // Verifica se houve colisão entre Mario e o cano
    if (
        pipeRect.left < marioRect.right - 10 &&
        pipeRect.right > marioRect.left + 10 &&
        marioRect.bottom > pipeRect.top + 10 &&
        marioRect.top < pipeRect.bottom - 10 &&
        !isGameOver
    ) {
        isGameOver = true;
        // Pausa a música de fundo ao game over
        if (bgmSound) bgmSound.pause();
        // Toca o som de colisão/game over
        if (gameoverSound) {
            gameoverSound.currentTime = 0;
            gameoverSound.play();
        }
        // Atualiza highscore se necessário
        if (jumpCount > highscore) {
            highscore = jumpCount;
            localStorage.setItem('marioHighscore', highscore);
            highscoreSpan.textContent = `Recorde: ${highscore}`;
        }
        // Para a animação do cano e fixa sua posição
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

    // Para a animação do Mario e fixa sua posição
    mario.classList.remove("jump"); // Remove qualquer animação de pulo imediatamente
    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;  

        // Troca a imagem do Mario para o game over
    // Garante que o tamanho do Mario seja aplicado antes de trocar a imagem
    // Salva a posição horizontal atual do Mario
    const marioLeft = mario.style.left;
    mario.style.width = "7vw";
    mario.style.minWidth = "50px";
    mario.style.maxWidth = "90px";
    mario.style.height = "10vw";
    mario.style.minHeight = "65px";
    mario.style.maxHeight = "120px";
    mario.style.objectFit = "contain";
    mario.src = "./images/game-over.png";
    // Reaplica a posição horizontal para garantir que não recue
    mario.style.left = marioLeft;
    mario.style.marginLeft = "0";

        // Para a animação das nuvens e fixa na posição correta
        const cloudsRight = window.getComputedStyle(clouds).right;
        clouds.style.animation = 'none';
        clouds.style.right = cloudsRight;
        clouds.style.left = 'auto';

        // Exibe o botão de reiniciar
        restartBtn.style.display = 'block';

        // Para o loop do jogo
        clearInterval(loop);
    }

}, 10);


// Adiciona o evento de pulo ao pressionar qualquer tecla
// Só conta pulo para teclas de pulo (W, Espaço ou Seta para cima)
document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') && !jumpKeyPressed) {
        jump(e);
    }
});

// Libera o pulo quando a tecla for solta
document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        jumpKeyPressed = false;
    }
});

// Reinicia o jogo ao clicar no botão de reiniciar
restartBtn.addEventListener('click', () => {
    window.location.reload();
});