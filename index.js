const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5175', // 클라이언트의 도메인
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true, // 쿠키를 허용하려면 true로 설정
  },
});

let name = 'Default Name'; // 현재 이름 상태

// CORS 허용 설정
app.use(cors());

// JSON 요청을 파싱할 수 있도록 설정
app.use(express.json());

// POST 요청으로 이름 업데이트 처리
app.post('/name', (req, res) => {
  const newName = req.body.name; // 요청으로 받은 새로운 이름
  if (newName) {
    name = newName; // 새로운 이름 저장
    io.emit('nameUpdated', name); // 모든 연결된 클라이언트에 이름 변경 이벤트 전송
    res.status(200).send({ message: 'Name updated successfully!' });
  } else {
    res.status(400).send({ message: 'Name is required' });
  }
});

// WebSocket 연결 처리
io.on('connection', (socket) => {
  console.log('A client connected');

  // 새로운 클라이언트가 연결되면 현재 이름을 즉시 전송
  socket.emit('nameUpdated', name);

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// 서버 시작
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
