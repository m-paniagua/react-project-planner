import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import TasksPage from './components/TasksPage';
import FlashMessage from './components/FlashMessage'
import { createTask, editTask, fetchTasks, filterTasks, deleteTask } from './actions'
import { getGroupedAndFilteredTasks } from './reducers'

class App extends Component {

  // get tasks from server
  componentDidMount() {
    this.props.dispatch(fetchTasks())
  }

  onCreateTask = ({ title, description }) => {
    // dispatch action to store
    this.props.dispatch(createTask({ title, description }))
  }

  onStatusChange = (id, status) => {
    // send status as object - {status: status}
    this.props.dispatch(editTask(id, { status }))
  }

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm))
  }

  onDeleteTask = id => {
    this.props.dispatch(deleteTask(id))
  }

  render() {
    return (
      <div className="container">
        {this.props.error &&
          <FlashMessage message={this.props.error} />}
        <div className="main-content">
          <TasksPage
            tasks={this.props.tasks}
            onCreateTask={this.onCreateTask}
            onStatusChange={this.onStatusChange}
            isLoading={this.props.isLoading}
            onSearch={this.onSearch}
            onDeleteTask={this.onDeleteTask}
          />
        </div>
      </div>

    );
  }
}

// retrieve tasks from store as props
function mapStateToProps(state) {
  const { isLoading, error } = state.tasks


  return {
    tasks: getGroupedAndFilteredTasks(state),
    isLoading,
    error
  }
}

// connect App component to redux store
export default connect(mapStateToProps)(App);
