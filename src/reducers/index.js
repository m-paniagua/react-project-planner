import { createSelector } from 'reselect'
import { TASK_STATUSES } from '../constants'

const initialTasksState = {
    items: {},
    isLoading: false,
    error: null
}

export function tasksReducer(state = initialTasksState, action) {
    switch (action.type) {
        case 'RECEIVE_ENTITIES': {
            const { entities } = action.payload

            if (entities && entities.tasks) {
                return {
                    ...state,
                    isLoading: false,
                    items: entities.tasks
                }
            }

            return state
        }

        // add newly created task to store
        case 'CREATE_TASK_SUCCEEDED': {
            const { task } = action.payload

            const nextTasks = {
                ...state.items,
                [task.id]: task
            }

            return {
                ...state,
                items: nextTasks
            }
        }


        // return updated list of tasks
        case 'EDIT_TASK_SUCCEEDED': {
            const { task } = action.payload

            // find index of project containing task
            const projectIndex = state.items.findIndex(
                project => project.id === task.projectId
            )
            const project = state.items[projectIndex]

            // find index in tasks array
            const taskIndex = project.tasks.findIndex(
                t => t.id === task.id
            )

            // delete old taks, add edited task to tasks array
            const nextProject = {
                ...project,
                tasks: [
                    ...project.tasks.slice(0, taskIndex),
                    task,
                    ...project.tasks.slice(taskIndex + 1)
                ]
            }

            return {
                ...state,
                items: [
                    ...state.items.slice(0, projectIndex),
                    nextProject,
                    ...state.items.slice(projectIndex + 1)
                ]
            }
        }

        // delete task with given id from store
        case 'DELETE_TASK_SUCCEEDED': {
            const { task } = action.payload

            // find index of project containing task
            const projectIndex = state.items.findIndex(
                project => project.id === task.projectId
            )

            const project = state.items[projectIndex]

            // get task index
            const taskIndex = project.tasks.findIndex(
                t => t.id === task.id
            )

            // delete task from tasks array
            const nextProject = {
                ...project,
                tasks: [
                    ...project.tasks.slice(0, taskIndex),
                    ...project.tasks.slice(taskIndex + 1)
                ]
            }

            // return items array with updated project
            return {
                ...state,
                items: [
                    ...state.items.slice(0, projectIndex),
                    nextProject,
                    ...state.items.slice(projectIndex + 1)
                ]
            }
        }

        default:
            return state
    }
}

// define initial state
const initialProjectsState = {
    items: {},
    isLoading: false,
    error: null,
}

// define how to handle action
export function projectsReducer(state = initialProjectsState, action) {
    // check action type
    switch (action.type) {
        case 'FETCH_PROJECTS_STARTED':
            return {
                ...state,
                isLoading: true
            }

        case 'RECEIVE_ENTITIES': {
            const { entities } = action.payload

            if (entities && entities.projects) {
                return {
                    ...state,
                    isLoading: false,
                    items: entities.projects
                }
            }
            return state
        }

        // add newly created task to store
        case 'CREATE_TASK_SUCCEEDED': {
            const { task } = action.payload

            const project = state.items[task.projectId]
            console.log(state.items[task.projectId])

            return {
                ...state,
                items: {
                    ...state.items,
                    [task.projectId]: {
                        ...project,
                        tasks: [...project.tasks, task.id]
                    }
                }

            }
        }

        default:
            return state
    }
}

const initialPageState = {
    currentProjectId: null,
    searchTerm: ""
}

export function pageReducer(state = initialPageState, action) {
    switch (action.type) {
        case 'SET_CURRENT_PROJECT_ID':
            return {
                ...state,
                currentProjectId: action.payload.id
            }

        case 'FILTER_TASKS':

            return {
                ...state,
                searchTerm: action.payload.searchTerm
            }

        default:
            return state
    }
}

export const getProjects = state => {
    return Object.keys(state.projects.items).map(id => {
        return state.projects.items[id]
    })
}

const getTasksById = state => {
    const { currentProjectId } = state.page

    if (!currentProjectId || !state.projects.items[currentProjectId]) {
        return []
    }

    const taskIds = state.projects.items[currentProjectId].tasks;

    return taskIds.map(id => state.tasks.items[id])
}

// return searchTerm from state
const getSearchTerm = state => state.page.searchTerm

export const getFilteredTasks = createSelector(
    [getTasksById, getSearchTerm],
    (tasks, searchTerm) => {
        // return tasks that contain search input
        return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')))
    }
)

export const getGroupedAndFilteredTasks = createSelector(
    [getFilteredTasks],
    tasks => {
        const grouped = {}

        TASK_STATUSES.forEach(status => {
            grouped[status] = tasks.filter(task => task.status === status)
        })
        // console.log(grouped)
        return grouped
    }
)

