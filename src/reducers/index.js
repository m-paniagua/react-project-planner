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
        case 'CREATE_TASK_SUCCEEDED':
        case 'EDIT_TASK_SUCCEEDED': {
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
        // case 'EDIT_TASK_SUCCEEDED': {
        //     const { task } = action.payload

        //     return {
        //         ...state,
        //         items: {
        //             ...state.items,
        //             [task.id]: task
        //         }
        //     }
        // }

        // delete task with given id from store
        case 'DELETE_TASK_SUCCEEDED': {
            const { task } = action.payload

            const { [task.id.toString()]: del, ...newTasks } = state.items
            console.log(newTasks)

            return {
                ...state,
                items: newTasks
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

        case 'DELETE_TASK_SUCCEEDED': {
            const { task } = action.payload

            // get project by id
            const project = state.items[task.projectId]
            // remove task from tasks array
            const filterTasks = project.tasks.filter(index => index !== task.id)

            return {
                ...state,
                items: {
                    ...state.items,
                    [task.projectId]: {
                        ...project,
                        tasks: filterTasks
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

