let { Server } = require('socket.io');

class locationLogSocket {
    constructor(server) {
        this.io = new Server(server, {
            path: '/locationLogSocket'
        });
        this.io.on('connection', socket => {
            socket.on('updateLocation', (locationData, room) => {
                app.post('/api/locationLog', locationData);
                if (room == '') {
                    socket.broadcast.emit('newLocation', locationData);
                } else {
                    socket.to(room).emit('newLocation', locationData);
                }
            });
            socket.on('joinRoom', room => {
                socket.join(room);
                let locationData = [];
                socket.in(room).sockets.forEach(element => {

                })
            });
            socket.on('leaveRoom', room => {
                socket.leave(room);
            });
            socket.on('disconnect', (lastLocationData) => {
                socket.leaveAll();
                app.post('/api/locationLog', lastLocationData);
            });
            socket.on(error => {
                console.log(error);
            })
        });
    }
}

module.exports = locationLogSocket;