const { Server } = require('socket.io');
const axios = require('axios');
const middleware = require('../Application/Middleware/middleware.js');

class LocationLogSocket {
    constructor(server) {
        this.socketIDMap = new Map();
        this.axiosInitialize();
        this.initializeSocket(server);
    }

    axiosInitialize() {
        this.api = axios.create({
            baseURL: `http://localhost:8080/api/locationLog`,
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': null
            }
        });
    }

    initializeSocket(server) {
        this.io = new Server(server, {
            path: '/locationLogSocket/'
        });
        this.configureMiddleware();
        this.handleSocketEvents();
    }

    configureMiddleware() {
        this.io.use(this.authenticateSocket.bind(this));
    }

    authenticateSocket(socket, next) {
        let tokenVerified = middleware.decodeTokenForSocket(socket.handshake.auth.token);

        if (tokenVerified.isValid === true) {
            this.configureAPIInterceptor(socket);
            this.socketIDMap.set(socket.id, tokenVerified.uid);
            return next();
        } else {
            const err = new Error("Not Authorized!");
            err.data = {
                reason: "Token not valid or expired!"
            };
            return next(err);
        }
    }

    configureAPIInterceptor(socket) {
        this.api.interceptors.request.use(
            config => {
                config.headers['Authorization'] = `Bearer ${socket.handshake.auth.token}`;
                return config;
            }, error => {
                return Promise.reject(error);
            }
        );
    }

    handleSocketEvents() {
        this.io.on('connection', socket => {
            socket.on('updateLocation', (locationData, room) => {
                this.api.post('/', locationData);
                if (room === null) {
                    socket.broadcast.emit('newLocation', locationData);
                } else {
                    socket.to(room).emit('newLocation', locationData);
                }
            });
            socket.on('joinRoom', room => {
                socket.join(room);
                this.io.in(room)
                    .fetchSockets()
                    .then(sockets => {
                        const locationPromises = sockets.map(element => {
                            return this.api
                                .get(`/`,
                                    {
                                        params: {
                                            id: this.socketIDMap.get(element.id)
                                        }
                                    }
                                )
                                .then(response => {
                                    return response.data[0];
                                });
                        });
                        return Promise.all(locationPromises);
                    })
                    .then(data => {
                        socket.emit('newLocation', data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
            socket.on('leaveRoom', room => {
                socket.leave(room);
            });
            socket.on('disconnect', () => {
                this.socketIDMap.delete(socket.id);
                socket.leaveAll();
            });
        });
    }
}

module.exports = LocationLogSocket;