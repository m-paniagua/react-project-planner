// import all api methods
import * as api from '../api'

// let _id = 1
// // create id for newly created tasks
// export function uniqueId() {
//     return _id++
// }

function fetchProjectStarted(boards) {
    return {
        type: 'FETCH_PROJECTS_STARTED',
        payload: { boards }
    }
}

function fetchProjectSucceeded(projects) {
    return {
        type: 'FETCH_PROJECTS_SUCCEEDED',
        payload: { projects }
    }
}

function fetchProjectsFailed(err) {
    return {
        type: 'FETCH_PROJECTS_FAILED',
        payload: err
    }
}

// add projects to store
export function fetchProjects() {
    return (dispatch, getState) => {
        // action to indicate start
        dispatch(fetchProjectStarted())

        return api.fetchProjects()
            .then(resp => {
                const projects = resp.data
                // send response body if success
                dispatch(fetchProjectSucceeded(projects))
            })
            .catch(err => {
                dispatch(fetchProjectsFailed(err))
            })
    }
}

// // add tasks to store after api call
// export function fetchTasksSucceeded(tasks) {
//     return {
//         type: 'FETCH_TASKS_SUCCEEDED',
//         payload: {
//             tasks
//         }
//     }
// }

// export function fetchTasksFailed(error) {
//     return {
//         type: 'FETCH_TASKS_FAILED',
//         payload: {
//             error
//         }
//     }
// }

// function fetchTasksStarted() {
//     return {
//         type: 'FETCH_TASKS_STARTED'
//     }
// }

// // make call to api
// export function fetchTasks() {
//     return dispatch => {
//         dispatch(fetchTasksStarted())

//         // make get request to api
//         api.fetchTasks()
//             .then(resp => {
//                 dispatch(fetchTasksSucceeded(resp.data))
//                 // throw new Error('Unable to fetch tasks!')
//             })
//             .catch(err => {
//                 dispatch(fetchTasksFailed(err.message))
//             })
//     }
// }

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
    return (dispatch, getState) => {
        // retrieve current project id from state
        const projectId = getState().page.currentProjectId

        api.createTask({ title, description, status, projectId }).then(resp => {
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
        // need current project id
        const projectId = getState().page.currentProjectId

        const task = getTaskById(getState().tasks.items, id, projectId)
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

export function deleteTaskSucceded(task) {
    return {
        type: 'DELETE_TASK_SUCCEEDED',
        payload: {
            task
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

// set id of selected project
export function setCurrentProjectId(id) {
    return {
        type: 'SET_CURRENT_PROJECT_ID',
        payload: {
            id
        }
    }
}

function getTaskById(projects, id, pId) {
    // find index of current project
    const projectIndex = projects.findIndex(
        project => project.id === pId
    )
    // return the task from array matches id
    return projects[projectIndex].tasks.find(task => task.id === id)
}