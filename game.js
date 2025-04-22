// 游戏地图配置
const levels = [
    [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 3, 0, 1],
        [1, 0, 2, 0, 1],
        [1, 1, 1, 1, 1]
    ]
];

// 游戏状态
let currentLevel = 0;
let gameMap = [];
let playerPos = {x: 0, y: 0};
let boxPositions = [];
let goalPositions = [];

// 初始化游戏
function initGame() {
    gameMap = JSON.parse(JSON.stringify(levels[currentLevel]));
    boxPositions = [];
    goalPositions = [];
    
    // 解析地图数据
    for (let y = 0; y < gameMap.length; y++) {
        for (let x = 0; x < gameMap[y].length; x++) {
            if (gameMap[y][x] === 2) { // 玩家
                playerPos = {x, y};
                gameMap[y][x] = 0;
            } else if (gameMap[y][x] === 3) { // 箱子
                boxPositions.push({x, y});
                gameMap[y][x] = 0;
            } else if (gameMap[y][x] === 4) { // 目标点
                goalPositions.push({x, y});
                gameMap[y][x] = 0;
            }
        }
    }
    
    renderGame();
}

// 渲染游戏
function renderGame() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    
    for (let y = 0; y < gameMap.length; y++) {
        const row = document.createElement('div');
        for (let x = 0; x < gameMap[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            if (gameMap[y][x] === 1) { // 墙
                cell.classList.add('wall');
            }
            
            // 检查目标点
            const isGoal = goalPositions.some(pos => pos.x === x && pos.y === y);
            if (isGoal) {
                cell.classList.add('goal');
            }
            
            // 检查玩家位置
            if (playerPos.x === x && playerPos.y === y) {
                cell.classList.add('player');
            }
            
            // 检查箱子位置
            const boxIndex = boxPositions.findIndex(pos => pos.x === x && pos.y === y);
            if (boxIndex !== -1) {
                cell.classList.add('box');
            }
            
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

// 移动玩家
function movePlayer(dx, dy) {
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;
    
    // 检查边界和墙壁
    if (newX < 0 || newY < 0 || newY >= gameMap.length || newX >= gameMap[newY].length || gameMap[newY][newX] === 1) {
        return;
    }
    
    // 检查箱子
    const boxIndex = boxPositions.findIndex(pos => pos.x === newX && pos.y === newY);
    if (boxIndex !== -1) {
        const boxNewX = newX + dx;
        const boxNewY = newY + dy;
        
        // 检查箱子能否推动
        if (boxNewX < 0 || boxNewY < 0 || boxNewY >= gameMap.length || boxNewX >= gameMap[boxNewY].length || 
            gameMap[boxNewY][boxNewX] === 1 || 
            boxPositions.some(pos => pos.x === boxNewX && pos.y === boxNewY)) {
            return;
        }
        
        // 推动箱子
        boxPositions[boxIndex] = {x: boxNewX, y: boxNewY};
    }
    
    // 移动玩家
    playerPos = {x: newX, y: newY};
    
    // 检查胜利条件
    checkWin();
    
    renderGame();
}

// 检查胜利条件
function checkWin() {
    const allBoxesOnGoals = boxPositions.every(box => {
        return goalPositions.some(goal => goal.x === box.x && goal.y === box.y);
    });
    
    if (allBoxesOnGoals) {
        alert('恭喜你赢了！');
        currentLevel = (currentLevel + 1) % levels.length;
        initGame();
    }
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
        case 'r': // 重置游戏
            initGame();
            break;
    }
});

// 初始化游戏
initGame();