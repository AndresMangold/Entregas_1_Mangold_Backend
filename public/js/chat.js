const socket = io();

const messageLogs = document.getElementById('messageLogs');
const chatBox = document.getElementById('chatBox');
let user;

socket.on('allMessages', (allMessages) => {
    messageLogs.innerHTML = '';

    allMessages.forEach((message) => {
        messageLogs.innerHTML += `<p><strong>${message.user}:</strong> ${message.message}</p>`;
    });
});

Swal.fire({
    title: "Identifícate para continuar",
    input: "text",
    text: "Ingresa tu username para identificarte en el chat",
    inputValidator: (value) => {
        if (!value) {
            return "¡Necesitas un nombre de usuario para continuar!";
        }
        return false;
    },
    allowOutsideClick: false
}).then(input => {
    user = input.value;
    setupListenersAndFetchMessages();
});

function setupListenersAndFetchMessages() {

    socket.on('allMessages', (allMessages) => {
        
        messageLogs.innerHTML = '';

        
        allMessages.forEach((message) => {
            messageLogs.innerHTML += `<p><strong>${message.user}:</strong> ${message.message}</p>`;
        });
    });

    
    socket.on('message', (message) => {
        
        messageLogs.innerHTML += `<p><strong>${message.user}:</strong> ${message.message}</p>`;
    });

    
    chatBox.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const message = chatBox.value.trim();
            if (message.length > 0) {
                socket.emit('message', { user, message });
                chatBox.value = '';
            }
        }
    });
}