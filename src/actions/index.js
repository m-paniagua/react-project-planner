// import all api methods
import * as api from '../api'

let _id = 1
// create id for newly created tasks
export function uniqueId() {
    return _id++
}

// add tasks to store after api call
export function fetchTasksSucceeded(tasks) {
    return {
        type: 'FETCH_TASKS_SUCCEEDED',
        payload: {
            tasks
        }
    }
}

export function fetchTasksFailed(error) {
    return {
        type: 'FETCH_TASKS_FAILED',
        payload: {
            error
        }
    }
}

function fetchTasksStarted() {
    return {
        type: 'FETCH_TASKS_STARTED'
    }
}

// make call to api
export function fetchTasks() {
    return dispatch => {
        dispatch(fetchTasksStarted())

        // make get request to api
        api.fetchTasks()
            .then(resp => {
                dispatch(fetchTasksSucceeded(resp.data))
                // throw new Error('Unable to fetch tasks!')
            })
            .catch(err => {
                dispatch(fetchTasksFailed(err.message))
            })
    }
}

// add newly created task to store
export function createTaskSucceeded(task) {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
            task
        }
    }
}
// create task called with obj with title and description properties
export function createTask({ title, description, status = 'Not Started' }) {
    // post request to api
    return dispatch => {
        api.createTask({ title, description, status }).then(resp => {
            dispatch(createTaskSucceeded(resp.data))
        })
    }
}

export function editTaskSucceeded(task) {
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        payload: {
            task
        }
    }
}

// change task of given id
export function editTask(id, params = {}) {
    return (dispatch, getState) => {
        const task = getTaskById(getState().tasks.tasks, id)
        const updatedTask = { ...task, ...params }

        api.editTask(id, updatedTask).then(resp => {
            dispatch(editTaskSucceeded(resp.data))
        })
    }
}

export function filterTasks(searchTerm) {
    return {
        type: 'FILTER_TASKS',
        payload: { searchTerm }
    }
}

export function deleteTaskSucceded(id) {
    return {
        type: 'DELETE_TASK_SUCCEEDED',
        payload: {
            id
        }
    }
}

export function deleteTask(id) {
    return dispatch => {
        api.deleteTask(id)
            .then(resp => {
                dispatch(deleteTaskSucceded(id))
            })
    }
}

function getTaskById(tasks, id) {
    return tasks.find(task => task.id === id)
}