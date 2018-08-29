// import all api methods
import * as api from '../api'
import { normalize, schema } from 'normalizr'

function receiveEntities(entities) {
    return {
        type: 'RECEIVE_ENTITIES',
        payload: entities
    }
}

function fetchProjectStarted(boards) {
    return {
        type: 'FETCH_PROJECTS_STARTED',
        payload: { boards }
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

                const normalizedData = normalize(projects, [projectSchema])

                dispatch(receiveEntities(normalizedData))

                // set default project on start
                // if (!getState().page.currentProjectId) {
                //     const defaultProjectId = projects[0].id
                //     dispatch(setCurrentProjectId(defaultProjectId))
                // }
            })
            .catch(err => {
                dispatch(fetchProjectsFailed(err))
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

        const task = getState().tasks.items[id]
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

export function deleteTask(task) {
    return dispatch => {
        api.deleteTask(task)
            .then(resp => {
                dispatch(deleteTaskSucceded(task))
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

// function getTaskById(projects, id, pId) {
//     // find index of current project
//     const projectIndex = projects.findIndex(
//         project => project.id === pId
//     )
//     // return the task from array matches id
//     return projects[projectIndex].tasks.find(task => task.id === id)
// }

// normalizr schema
const taskSchema = new schema.Entity('tasks')
const projectSchema = new schema.Entity('projects', {
    tasks: [taskSchema]
})