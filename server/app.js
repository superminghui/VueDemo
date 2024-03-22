const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors({
	origin: 'http://localhost:8080',
	credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true,  //? usage? 
  cookie: { 
    secure: false, // 在生产中对HTTPS设置为true
    maxAge: 120000 // 设置会话有效期为1分钟
  }
}));

// 登录路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'user123' && password === 'pass456') {
    req.session.user = { username }; // 将用户信息存储在会话中
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// 受保护的资源路由
app.get('/protected', (req, res) => {
  if (req.session.user) {
    res.json({ content: 'Protected resources' });
  } else {
    res.status(401).send('Session expired. Please login again.');
  }
});

// 新增的会话检查路由
app.get('/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

