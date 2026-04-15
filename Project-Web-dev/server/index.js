import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Allow all origins for simplicity in dev
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle timer start
    socket.on('startTimer', (duration) => {
        console.log(`Timer started for ${duration} seconds by ${socket.id}`);

        // Simulate timer on server (simple timeout)
        // In a real app, you might want to track this more robustly
        setTimeout(() => {
            io.to(socket.id).emit('timerFinished');
            console.log(`Timer finished for ${socket.id}`);
        }, duration * 1000);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
