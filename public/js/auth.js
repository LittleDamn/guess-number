// 用户状态管理
const userState = {
    isLoggedIn: false,
    userId: null,
    username: '',
    email: ''
};

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 检查本地存储中的登录状态
    const savedUser = localStorage.getItem('guessNumberUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        loginUser(user.username, user.email);
    }
    
    // 设置事件监听器
    setupAuthEventListeners();
});

// 设置认证事件监听器
function setupAuthEventListeners() {
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活动标签
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // 设置当前活动标签
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // 登录表单提交
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // 在实际应用中，这里会发送到后端验证
        if (email && password) {
            // 模拟登录成功
            loginUser('游戏玩家', email);
        }
    });
    
    // 注册表单提交
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        
        // 简单验证
        if (password !== confirm) {
            alert('两次输入的密码不一致！');
            return;
        }
        
        if (username && email && password) {
            // 模拟注册成功并自动登录
            loginUser(username, email);
            alert('注册成功！已自动登录。');
        }
    });
    
    // 退出登录
    document.getElementById('logout-btn').addEventListener('click', logoutUser);
}

// 用户登录
function loginUser(username, email) {
    userState.isLoggedIn = true;
    userState.username = username;
    userState.email = email;
    
    // 更新UI
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('username-display').textContent = username;
    document.getElementById('email-display').textContent = email;
    
    // 隐藏登录/注册表单
    document.getElementById('login-tab').style.display = 'none';
    document.getElementById('register-tab').style.display = 'none';
    
    // 保存到本地存储
    localStorage.setItem('guessNumberUser', JSON.stringify({
        username: username,
        email: email
    }));
}

// 用户退出
function logoutUser() {
    userState.isLoggedIn = false;
    userState.username = '';
    userState.email = '';
    
    // 更新UI
    document.getElementById('user-info').style.display = 'none';
    document.getElementById('login-tab').style.display = 'block';
    document.getElementById('register-tab').style.display = 'none';
    
    // 重置表单
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    
    // 设置活动标签
    document.querySelector('.tab-btn[data-tab="login"]').classList.add('active');
    document.getElementById('login-tab').classList.add('active');
    document.querySelector('.tab-btn[data-tab="register"]').classList.remove('active');
    
    // 清除本地存储
    localStorage.removeItem('guessNumberUser');
}