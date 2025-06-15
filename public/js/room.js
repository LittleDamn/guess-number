// 房间状态
let roomState = {
    id: null,
    name: '',
    status: 'waiting',
    players: []
};

// 游戏状态
let gameState = {
    currentPlayer: null,
    secretNumber: 0,
    minRange: 1,
    maxRange: 100,
    timer: null,
    timeLeft: 30,
    history: []
};

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 获取房间ID
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    
    if (roomId) {
        // 加载房间信息
        loadRoom(roomId);
        
        // 设置事件监听器
        setupRoomEventListeners();
    } else {
        alert('无效的房间ID！');
        window.location.href = 'index.html';
    }
});

// 加载房间信息
function loadRoom(roomId) {
    // 模拟从后端获取房间信息
    // 这里使用硬编码的房间信息
    roomState = {
        id: roomId,
        name: `房间 ${roomId}`,
        status: 'waiting',
        players: [
            { id: 1, name: "你", score: 0, isActive: true },
            { id: 2, name: "玩家B", score: 0, isActive: false },
            { id: 3, name: "玩家C", score: 0, isActive: false }
        ]
    };
    
    // 更新UI
    document.getElementById('room-title').textContent = roomState.name;
    document.getElementById('room-details').textContent = `房间ID: ${roomState.id} | 创建者: 玩家A`;
    
    // 设置房间状态
    updateRoomStatus(roomState.status);
    
    // 渲染玩家列表
    renderPlayers();
    
    // 初始化游戏
    initGame();
}

// 更新房间状态
function updateRoomStatus(status) {
    roomState.status = status;
    
    const statusIndicator = document.getElementById('room-status-indicator');
    const statusText = document.getElementById('room-status-text');
    
    if (status === 'playing') {
        statusIndicator.className = 'status-indicator playing';
        statusText.textContent = '游戏中';
    } else {
        statusIndicator.className = 'status-indicator';
        statusText.textContent = '等待中';
    }
}

// 渲染玩家列表
function renderPlayers() {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = '';
    
    roomState.players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${player.isActive ? 'active' : ''}`;
        playerCard.innerHTML = `
            <div class="player-avatar">
                <i class="fas fa-${player.id === 1 ? 'user' : 'robot'}"></i>
            </div>
            <h3 class="player-name">${player.name}</h3>
            <p class="player-score">${player.score}分</p>
            <p>状态: <strong>${player.isActive ? '游戏中' : '等待'}</strong></p>
        `;
        playersContainer.appendChild(playerCard);
    });
}

// 初始化游戏
function initGame() {
    // 重置游戏状态
    gameState.secretNumber = Math.floor(Math.random() * 100) + 1;
    gameState.minRange = 1;
    gameState.maxRange = 100;
    gameState.timeLeft = 30;
    gameState.history = [];
    
    // 设置当前玩家
    gameState.currentPlayer = roomState.players[0].name;
    document.getElementById('current-player').textContent = gameState.currentPlayer;
    document.getElementById('number-range').textContent = `${gameState.minRange} - ${gameState.maxRange}`;
    document.getElementById('countdown').textContent = `${gameState.timeLeft}秒`;
    
    // 清空历史记录
    document.getElementById('game-history').innerHTML = '';
    
    // 启动计时器
    startTimer();
}

// 启动计时器
function startTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('countdown').textContent = `${gameState.timeLeft}秒`;
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            nextPlayer();
        }
    }, 1000);
}

// 设置房间事件监听器
function setupRoomEventListeners() {
    // 返回大厅按钮
    document.getElementById('back-to-lobby').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // 猜测表单提交
    document.getElementById('guess-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const guess = parseInt(document.getElementById('guess-input').value);
        submitGuess(guess);
    });
}

// 提交猜测
function submitGuess(guess) {
    if (guess < gameState.minRange || guess > gameState.maxRange) {
        alert(`请输入${gameState.minRange}到${gameState.maxRange}之间的数字！`);
        return;
    }
    
    // 清空输入框
    document.getElementById('guess-input').value = '';
    
    // 判断猜测结果
    let