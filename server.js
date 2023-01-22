const express = require('express');
const app = express(); 
const socket = require('socket.io');

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const tasks = [];
const io = socket(server, { cors: {origin: "*"}});

io.on('connection', (socket) => { //connection - jest to event wysyłany automatycznie przez każdy socket w momencie inicjacji połączenia. 
    socket.emit('updateData', tasks); // user uruchamia aplikację i od razu otrzymuje wszystkie taski w liście (przechowywane w tablicy tasks)

    socket.on('addTask', (task) => {

        socket.broadcast.emit('addTask', task); // emituję zdarzenie addTask do wszystkich socketów *Z WYJĄTKIEM* tego, który dodał task
    });

    socket.on('removeTask', (id) => {
        const taskId = tasks.find(task => task.id === id); // wyszukujemy task w tablicy tasks o zgodnym id
        tasks.splice(taskId, 1); // usuwamy task o zgodnym id
        socket.broadcast.emit('removeTask', id); // emituję zdarzenie removeTask do wszystkich socketów *Z WYJĄTKIEM* tego, który usunął task
    })

})


app.use((req, res) => {
    res.status(404).send({ message: 'Not found...'});
});