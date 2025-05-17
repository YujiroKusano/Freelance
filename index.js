const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (applicationId) => {
    socket.join(`room-${applicationId}`);
  });

  socket.on('send-message', async ({ applicationId, content, senderId }) => {
    const message = await prisma.message.create({
      data: { applicationId, content, senderId }
    });
    io.to(`room-${applicationId}`).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.json());
app.get('/', (req, res) => res.send('Server running'));

server.listen(3000, () => console.log('Listening on port 3000'));