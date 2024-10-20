const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: '*'} });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

io.on('connection', (socket) => {
    console.log('Client is Connected');
    socket.on('taskUpdated', () => {
        io.emit('updateTasks');
    });
    socket.on('disconnect', () =>  console.log('Client is Disconnected'));
})

app.use('/api/tasks', taskRoutes(io));
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on Port No: ${PORT}`));