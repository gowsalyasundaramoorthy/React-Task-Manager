import React from 'react';
import './App.css';
import Loader from './Components/Loader';
import TaskList from './Components/TaskList';


const userId = 1;
const isToDoCompleted = false;
class App extends React.Component {

constructor(props) {
  super(props)
  this.state = {
    items: [],
    task: ''
  };

this.taskInput = React.createRef();
this.loaderInstance = React.createRef();

this.onInputChange = this.onInputChange.bind(this);
this.addTask = this.addTask.bind(this);
this.storeTask = this.storeTask.bind(this);

}
  componentDidMount() {
    this.handleLoader(true);
    this.fetchTasks();

  }
  
  handleLoader(status = false) {
    this.loaderInstance.current.updateLoaderVisibility(status);
  }
  
  
  onInputChange(event) {
    this.setState({ task: event.target.value })
  }

  addTask(event) {
    event.preventDefault();

    if(this.state.task) {
      this.handleLoader(true);
      this.storeTask();

      this.setState({
        task: ''
      });
    } else {
      alert('Task cannot be empty');
    }

    this.taskInput.current.focus();
  }

  storeTask() {
    return fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
              userId: userId,
              title: this.state.task,
              completed: isToDoCompleted
            }),
            headers: {
                'Content-type': "application/json; charset=UTF-8"
            }
      })
      .then(response => response.json())
      .then((task) => {
        this.setState({
          items: this.state.items.concat(task)
        });
      })
      
            .then(() => {
              this.handleLoader(false)
            })
            .catch(console.error)
  };

  fetchTasks() {
    return fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      .then(response => response.json())
      .then(tasks => {
        this.setState({ items: tasks });
      })
            .then(() => {
              this.handleLoader(false)
            })
            .catch(console.error)

  }


  render() {
    return (
      <div className='task-app container-fluid'>
        <div className='container p-5'>
          <h1>My tasks</h1>
          <Loader ref={this.loaderInstance}  />
          <form className='' onSubmit={this.addTask}>
            <input id='task-input' placeholder='Enter task here' className='form-control' onChange={this.onInputChange} value={this.state.task} ref={this.taskInput} autoComplete='off' ></input>
            <button className='btn btn-info ml-1 font-weight-bold'>Add new task</button>
          </form>
          <TaskList items={this.state.items }  />
        </div>
      </div>
    );
  }
}

export default App