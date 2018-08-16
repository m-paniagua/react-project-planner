import React, { Component } from 'react'
import TaskList from './TaskList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons'

class TasksPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showNewCardForm: false,
            title: '',
            description: '',
        }
    }

    // on user input of title field
    onTitleChange = e => {
        this.setState({ title: e.target.value })
    }

    // on user input of description field
    onDescriptionChange = e => {
        this.setState({ description: e.target.value })
    }

    onSearch = e => {
        this.props.onSearch(e.target.value)
    }

    // clear form fields
    resetForm() {
        this.setState({
            showNewCardForm: false,
            title: '',
            description: '',
        })
    }

    // on form submit
    onCreateTask = e => {
        e.preventDefault()
        this.props.onCreateTask({
            title: this.state.title,
            description: this.state.description,
        })
        this.resetForm()
    }

    // open/close form
    toggleForm = () => {
        this.setState({ showNewCardForm: !this.state.showNewCardForm })
    }

    renderTasksList() {
        const { onStatusChange, tasks, onDeleteTask } = this.props

        return Object.keys(tasks).map(status => {
            const tasksByStatus = tasks[status]

            return (
                <TaskList
                    key={status}
                    status={status}
                    tasks={tasksByStatus}
                    onStatusChange={onStatusChange}
                    onDeleteTask={onDeleteTask}
                />
            )
        })
    }

    render() {
        if (this.props.isLoading) {
            return (
                <div className="tasks-loading">
                    <FontAwesomeIcon
                        icon={faSpinner}
                        className="fa-spin"
                        style={{ 'fontSize': "64px" }}
                    />
                </div>
            )
        }
        return (
            <div className="tasks">
                <div className="task-header">
                    <h1>Project Planner</h1>
                    <input
                        onChange={this.onSearch}
                        type="text"
                        placeholder="Search..."
                    />
                    <button
                        className="button button-default"
                        onClick={this.toggleForm}
                    >
                        <FontAwesomeIcon icon={faPlusCircle} /> New
                    </button>
                </div>
                {this.state.showNewCardForm && (
                    <form onSubmit={this.onCreateTask} className="new-task-form">
                        <input
                            type="text"
                            className="full-width-input"
                            onChange={this.onTitleChange}
                            value={this.state.title}
                            placeholder="Title"
                        />
                        <input
                            type="text"
                            className="full-width-input"
                            onChange={this.onDescriptionChange}
                            value={this.state.description}
                            placeholder="Description"
                        />
                        <button
                            className="button"
                            type="submit"
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </form>
                )}

                <div className="task-lists">
                    {this.renderTasksList()}
                </div>
            </div>
        )
    }
}

export default TasksPage