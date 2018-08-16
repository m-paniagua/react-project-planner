import React from 'react'
import Task from './Task'

const TaskList = (props) => {
    return (
        <div className="task-list">
            <div className="task-list-title">
                <strong>{props.status}</strong>
            </div>
            {/* create Task for each elem in tasks array */}
            {props.tasks.map(task => {
                return <Task
                    key={task.id}
                    task={task}
                    onStatusChange={props.onStatusChange}
                    onDeleteTask={props.onDeleteTask}
                />
            })}
        </div>
    )
}

export default TaskList