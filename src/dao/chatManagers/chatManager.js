const { Messages } = require('../models');

class ChatManager {
    constructor(io) {
        this.io = io;
        this.io.on('connection', async (socket) => {
            try {
                const allMessages = await Messages.find().sort({ createdAt: 1 });
                socket.emit('allMessages', allMessages);

                socket.on('message', async (data) => {
                    await this.handleMessage(data);
                    this.io.emit('message', data);
                });
            } catch (error) {
                console.error('Error en la conexión del cliente:', error);
            }
        });
    }

    async handleMessage(data) {
        try {
            let existingUser = await Messages.findOne({ user: data.user });
            if (existingUser) {
                await Messages.updateOne(
                    { user: data.user },
                    { $push: { messages: data.message } }
                );
            } else {
                await Messages.create({
                    user: data.user,
                    messages: [data.message]
                });
            }
            console.log({ Usuario: data.user }, { Mensaje: data.message });
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    }

    async prepare() {
        if (Messages.db.readyState !== 1) {
            throw new Error('must connect to mongodb!')
        }
    }
}

module.exports = ChatManager;