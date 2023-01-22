import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socket from 'socket.io-client';


const App = () => {
  //const [socket, setSocket] = useState(null);
  const [io, setIO] = useState(socket());
  const [taskName, setTaskName] = useState('');
  const emit = true;

  useEffect(() => {
    // const socket = io('localhost:8000');
    // setSocket(socket);
    io.on('addTask', (task) => addTask(task));
    io.on('removeTask', (id) => removeTask(id));
    io.on('updateData', (tasks) => updateTasks(tasks));
  }, []);
  
  const [ tasks, setTasks ] = useState([]);

  const removeTask = (id, emit) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    if (emit) {
      io.emit('removeTask', id)
    }
  }

  const submitForm = (event) => {
    event.preventDefault();
    addTask({id: uuidv4(), name: taskName});
    io.emit('addTask', {id: uuidv4, name: taskName });
  }
  
  const addTask = task => {
    setTasks((tasks) => [...tasks, task]);
  };

  const updateTasks = task => {
    setTasks(tasks);
  }

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => 
              <li className="task" key={task.id}>{task.name}<button className="btn btn--red" onClick={() => removeTask(task.id, emit)}>Remove</button></li>
          )}
          
          {/* <li className="task">Go out with a dog <button className="btn btn--red">Remove</button></li> */}
        </ul>
  
        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autocomplete="off" type="text" placeholder="Type your description" id="task-name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>
  
      </section>
    </div>
  );
}

export default App;