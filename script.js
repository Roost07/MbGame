const gridSize = 5;
const gridContainer = document.getElementById('grid-container');
const cells = [];
const missesElement = document.getElementById('misses');
const hitsElement = document.getElementById('hits');
// Создание игрового поля
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = i;
        cell.dataset.col = j;
        cells.push(cell);
        gridContainer.appendChild(cell);
    }
}
// Логика игры
let attempts = 0;
let hits = 0;
const missedCells = new Set(); // Множество для хранения промахов
const ships = []; // Массив для хранения координат кораблей
let gameIsOver = false;
// Создание 3-х случайных координат для кораблей
for (let i = 0; i < 3; i++) {
    let shipRow, shipCol;
    do {
        shipRow = Math.floor(Math.random() * gridSize);
        shipCol = Math.floor(Math.random() * gridSize);
    } while (ships.some(ship => ship.row === shipRow && ship.col === shipCol));
    ships.push({ row: shipRow, col: shipCol });
}
gridContainer.addEventListener('click', (event) => {
    if (gameIsOver) return; // Если игра завершена, не обрабатываем клики
    const target = event.target;
    if (target.classList.contains('cell')) {
        const row = parseInt(target.dataset.row);
        const col = parseInt(target.dataset.col);
        if (target.classList.contains('hit')) {
            alert('Ты уже стрелял в эту клетку!');
        } else if (missedCells.has(`${row}-${col}`)) {
            alert('Ты уже промахивался в эту клетку!');
        } else {
            attempts++;

            let isHit = false;

            for (const ship of ships) {
                if (row === ship.row && col === ship.col) {
                    target.classList.add('hit');
                    target.textContent = '';
                    hits++;
                    isHit = true;
                    alert('Попадание!');
                    break;
                }
            }
            if (!isHit) {
                target.classList.add('miss');
                target.style.backgroundColor = 'yellow'; // Сделать клетку желтой при промахе
                alert('Промах!');
                missedCells.add(`${row}-${col}`);
            }
        }
        if (hits === ships.length) {
            gameIsOver = true;
            alert('Поздравляем! Вы победили за ' + attempts + ' попыток!');
            unlockRemainingCells();
        }
        // Обновление количества промахов и попаданий
        missesElement.textContent = missedCells.size;
        hitsElement.textContent = hits;
    }
});
// Функция для закраски оставшихся закрытых ячеек в желтый цвет после выигрыша
function unlockRemainingCells() {
    for (const cell of cells) {
        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
            cell.style.backgroundColor = 'yellow';
        }
    }
}