// 游戏房间数据
let gameRooms = [];

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 设置事件监听器
    setupLobbyEventListeners();
    
    // 加载房间列表
    loadRooms();
});

// 设置大厅事件监听器
function setupLobbyEventListeners() {
    // 创建房间
    document.getElementById('create-room-btn').addEventListener('click', createRoom);
    
    // 刷新房间列表
    document.getElementById('refresh-btn').addEventListener('click', loadRooms);
}

// 加载房间列表
function loadRooms() {
    // 模拟从后端获取房间列表
    // 在实际应用中，这里会发送API请求
    gameRooms = [
        { id: 1, name: "休闲房间", players: 2, maxPlayers: 4, status: "waiting", creator: "玩家A" },
        { id: 2, name: "高手挑战", players: 3, maxPlayers: 4, status: "playing", creator: "玩家B" },
        { id: 3, name: "新手练习", players: 1, maxPlayers: 4, status: "waiting", creator: "玩家C" },
        { id: 4, name: "周末娱乐", players: 4, maxPlayers: 4, status: "playing", creator: "玩家D" },
        { id: 5, name: "快速游戏", players: 2, maxPlayers: 4, status: "waiting", creator: "玩家E" }
    ];
    
    renderRoomList();
}

// 渲染房间列表
function renderRoomList() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';
    
    if (gameRooms.length === 0) {
        roomList.innerHTML = '<div class="no-rooms">暂无可用房间，请创建一个新房间！</div>';
        return;
    }
    
    gameRooms.forEach(room => {
        const roomItem = document.createElement('div');
        roomItem.className = 'room-item';
        roomItem.innerHTML = `
            <div class="room-info">
                <div class="room-name">${room.name}</div>
                <div class="room-details">
                    <span class="room-players">${room.players}/${room.maxPlayers} 玩家</span>
                    <span class="room-status ${room.status === 'playing' ? 'status-playing' : 'status-waiting'}">
                        ${room.status === 'playing' ? '游戏中' : '等待中'}
                    </span>
                </div>
            </div>
            <button class="btn btn-secondary join-btn" data-room-id="${room.id}">
                ${room.status === 'playing' ? '观战' : '加入'}
            </button>
        `;
        roomList.appendChild(roomItem);
        
        // 添加加入房间事件
        roomItem.querySelector('.join-btn').addEventListener('click', function() {
            const roomId = this.getAttribute('data-room-id');
            joinRoom(roomId);
        });
    });
}

// 创建房间
function createRoom() {
    const user = JSON.parse(localStorage.getItem('guessNumberUser'));
    if (!user) {
        alert('请先登录！');
        document.querySelector('.tab-btn[data-tab="login"]').click();
        return;
    }
    
    const roomName = prompt('请输入房间名称：', `${user.username}的房间`);
    if (roomName) {
        // 模拟创建房间
        const newRoom = {
            id: Date.now(), // 使用时间戳作为唯一ID
            name: roomName,
            players: 1,
            maxPlayers: 4,
            status: "waiting",
            creator: user.username
        };
        
        // 添加到房间列表
        gameRooms.unshift(newRoom);
        renderRoomList();
        
        // 加入房间
        joinRoom(newRoom.id);
    }
}

// 加入房间
function joinRoom(roomId) {
    const room = gameRooms.find(r => r.id == roomId);
    if (!room) {
        alert('房间不存在或已关闭！');
        return;
    }
    
    if (room.players >= room.maxPlayers && room.status !== 'playing') {
        alert('房间已满！');
        return;
    }
    
    // 在实际应用中，这里会重定向到房间页面
    window.location.href = `room.html?roomId=${roomId}`;
}