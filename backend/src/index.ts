import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import Game from './game';
import Player from './player';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const game = new Game();
game.on('newQuestion', (state) => {
  io.emit('newQuestion', state)
})
game.on('sendScores', (scores) => {
  io.emit('scores', scores)
})

io.on('connection', async (socket) => {
  socket.emit('newQuestion', game.getState())
  const player = new Player(socket)
  player.on('tryAnswer', async (value) => {
    if (game.checkAnswer(value)) {
      await player.scorePlus();
      game.sendScores();
    }
  })
  player.on('sendScores', async () => {
    game.emit('sendScores', await game.getScores())
  })
  player.sendScores(await game.getScores())
})

app.use(express.static(__dirname + '/../../frontend/build'))

server.listen(3000, () => {
  console.log('app is listening')
});