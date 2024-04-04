const { Messages, AllMessages } = require('../models');

class ChatManager {
    constructor(io) {
        this.io = io;
        this.io.on('connection', async (socket) => {
            try {
                const allMessages = await AllMessages.findOne({ _id: '660df59f6e542d70b8706764' });
                socket.emit('allMessages', allMessages.messages);

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
            const newMessage = {
                user: data.user,
                message: data.message
            }

            let allMessages = await AllMessages.findOne();
            if (!allMessages) {
                allMessages = await AllMessages.create({ messages: [newMessage] });
            } else {
                allMessages.messages.push(newMessage);
                await allMessages.save();
            }

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

            console.log('Mensaje guardado:', newMessage);
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