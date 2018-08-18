import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


const TASK_STATUSES = ['Not Started', 'In Progress', 'Completed']

const Task = (props) => {
    return (
        <div className="task">
            <div className="task-header">
                <div>{props.task.title}</div>
                <select
                    value={props.task.status}
                    onChange={onStatusChange}
                >
                    {TASK_STATUSES.map(status =>
                        <option key={status} value={status}>{status}</option>
                    )}
                </select>
            </div>
            <hr />
            <div className="task-body">{props.task.description}
                <button
                    onClick={onDeleteTask}
                    className="del-button button"
                >
                    <FontAwesomeIcon icon={faTrash} />

                </button>
            </div>
        </div>
    )

    function onStatusChange(e) {
        props.onStatusChange(props.task.id, e.target.value)
    }

    function onDeleteTask() {
        // console.log('delteing task: ', props.task.title)
        props.onDeleteTask(props.task)
    }

}

export default Task