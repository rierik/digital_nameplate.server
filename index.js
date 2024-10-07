const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let name = 'Default Name'; // 현재 이름 상태

// 정적 파일 제공 (Vue/React에서 빌드된 파일들을 나중에 여기에 추가할 수 있음)
app.use(express.static('public'));

// POST 요청으로 이름 업데이트
app.use(express.json());
app.post('/name', (req, res) => {
  name = req.body.name; // 새로운 이름 저장
  io.emit('nameUpdated', name); // 모든 연결된 클라이언트에 이름 변경 이벤트 전송
  res.status(200).send({ message: 'Name updated successfully!' });
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
