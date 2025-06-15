const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const db = require('./database');
const authRoutes = require('./auth');
const roomRoutes = require('./room');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 中间件
app.use(bodyParser.json());
app.use(express.static('../public'));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/room', roomRoutes);

// WebSocket连接
io.on('connection', (socket) => {
  console.log('新用户连接');
  
  // 加入房间
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    // 通知房间内其他玩家
    socket.to(roomId).emit('playerJoined', socket.userId);
  });
  
  // 处理玩家猜测
  socket.on('makeGuess', (data) => {
    const { roomId, guess } = data;
    // 验证猜测并广播结果
    io.to(roomId).emit('guessResult', {
      playerId: socket.userId,
      guess,
      result: 'too_low' // 示例结果
    });
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接');
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});