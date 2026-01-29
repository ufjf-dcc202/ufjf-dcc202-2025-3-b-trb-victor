const gridEl = document.getElementById('grid');
let playerState = { x: 0, y: 0, dir: 1 }; // 0:N, 1:L, 2:S, 3:O

// 0: Buraco, 1: Chão, 2: Luz Apagada
const levels = [
    {
        map: [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1],
            [0, 0, 1, 0, 0],
            [0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0]
        ],
        start: { x: 0, y: 1, dir: 1 }
    }
];
let currentLevel = 0;

function loadLevel(index) {
    const lvl = levels[index];
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = `repeat(${lvl.map[0].length}, 60px)`;

    lvl.map.forEach((row, y) => {
        row.forEach((type, x) => {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;

            if (type === 1) cell.classList.add('active');
            if (type === 2) cell.classList.add('active', 'light-off'); // Usa alvo.png
            
            gridEl.appendChild(cell);
        });
    });
    renderPlayer(lvl.start);
}

function renderPlayer(state) {
    const old = document.querySelector('.player');
    if (old) old.remove();

    // Encontra a célula onde o player deve estar
    const cell = document.querySelector(`.cell[data-x="${state.x}"][data-y="${state.y}"]`);
    if (cell) {
        const p = document.createElement('div');
        p.className = 'player';
        // Ajuste o ângulo conforme seu desenho. Assumindo 0=Cima
        // Se seu robô olha para a direita por padrão, ajuste a soma (+90)
        p.style.transform = `rotate(${state.dir * 90}deg)`; 
        cell.appendChild(p);
    }
}
let program = [];

function addCmd(cmd) {
    program.push(cmd);
    updateUI();
}

function updateUI() {
    document.getElementById('main-prog').innerText = program.join(' -> ');
}

function resetLevel() {
    program = [];
    updateUI();
    // Recarrega o nível para resetar posições e luzes
    loadLevel(currentLevel); 
    // Garante que o estado interno do player volte ao inicial
    playerState = { ...levels[currentLevel].start };
}

function executeCommand(cmd) {
    const lvl = levels[currentLevel];
    let { x, y, dir } = playerState;

    if (cmd === 'L') dir = (dir + 3) % 4; // Gira esq
    else if (cmd === 'R') dir = (dir + 1) % 4; // Gira dir
    else if (cmd === 'F' || cmd === 'J') { // J (Pular) simplificado para andar
    else if (cmd === 'X') {
    const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell && cell.classList.contains('light-off')) {
            cell.classList.remove('light-off'); 
            cell.classList.add('light-on');    
        }
    }
// ...
        let nx = x, ny = y;
        if (dir === 0) ny--; // Norte
        if (dir === 1) nx++; // Leste
        if (dir === 2) ny++; // Sul
        if (dir === 3) nx--; // Oeste

        if (ny >= 0 && ny < lvl.map.length && nx >= 0 && nx < lvl.map[0].length) {
            if (lvl.map[ny][nx] > 0) {
                x = nx; y = ny;
            }
        }
    }

    playerState = { x, y, dir };
    renderPlayer(playerState);

    async function runProgram() {
    // Reseta visualmente antes de rodar
    loadLevel(currentLevel); 
    playerState = { ...levels[currentLevel].start };
    
    for (let cmd of program) {
        await new Promise(r => setTimeout(r, 500)); // Espera 500ms
        executeCommand(cmd);
        checkWin();
    }
}
function checkWin() {
    // Conta quantos alvos restam (quantos ainda tem 'light-off')
    const remaining = document.querySelectorAll('.light-off').length;
    
    if (remaining === 0) {
        setTimeout(() => {
            alert("Nível Concluído!");
            currentLevel++;
            if (currentLevel < levels.length) {
                program = [];
                updateUI();
                loadLevel(currentLevel);
            } else {
                alert("Parabéns! Você completou o jogo.");
                currentLevel = 0;
                loadLevel(0);
            }
        }, 500);
    }
}
const levels = [
    {   // Fase 1: Linha Reta
        map: [
            [0,0,0,0,0],
            [1,1,1,2,0],
            [0,0,0,0,0]
        ], start: {x:0, y:1, dir:1}
    },
    {   // Fase 2: Curva
        map: [
            [0,0,2,0,0],
            [0,0,1,0,0],
            [1,1,1,0,0],
            [0,0,0,0,0]
        ], start: {x:0, y:2, dir:1}
    },
    {   // Fase 3: Zig Zag com Pulo (buraco 0 no meio)
        map: [
            [1,0,1,0,2],
            [1,1,1,1,1],
            [0,0,0,0,0]
        ], start: {x:0, y:0, dir:1}
    }
];
}

loadLevel(0);