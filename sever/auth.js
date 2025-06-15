const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database');

const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  
  // 验证输入
  if (!email || !username || !password) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }
  
  try {
    // 检查邮箱是否已存在
    const user = await db.getUserByEmail(email);
    if (user) {
      return res.status(409).json({ error: '邮箱已被注册' });
    }
    
    // 哈希密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 创建用户
    const newUser = await db.createUser(email, username, hashedPassword);
    
    res.status(201).json({ 
      message: '用户注册成功',
      userId: newUser.id
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // 查找用户
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: '无效的邮箱或密码' });
    }
    
    // 验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: '无效的邮箱或密码' });
    }
    
    // 创建JWT令牌
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;