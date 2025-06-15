const express = require('express');
const db = require('./database');

const router = express.Router();

// 获取房间列表
router.get('/list', async (req, res) => {
  try {
    const rooms = await db.getRooms();
    res.json(rooms);
  } catch (error) {
    console.error('获取房间列表错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 创建房间
router.post('/create', async (req, res) => {
  const { name, userId } = req.body;
  
  if (!name || !userId) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  try {
    const newRoom = await db.createRoom(name, userId);
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('创建房间错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 加入房间
router.post('/join', async (req, res) => {
  const { roomId, userId } = req.body;
  
  if (!roomId || !userId) {
    return res.status(400).json({ error: '缺少必要参数' });
  }
  
  try {
    const result = await db.joinRoom(roomId, userId);
    res.json(result);
  } catch (error) {
    console.error('加入房间错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;