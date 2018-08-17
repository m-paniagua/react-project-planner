import { createSelector } from 'reselect'
import { TASK_STATUSES } from '../constants'

// define initial state
const initialProjectsState = {
    items: [],
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

        case 'FETCH_PROJECTS_SUCCEEDED':
            return {
                ...state,
                items: action.payload.projects,
                isLoading: false,
            }

        // return next state with tasks from payload
        // case 'FETCH_TASKS_SUCCEEDED':
        //     return {
        //         ...state,
        //         isLoading: false,
        //         tasks: action.payload.tasks,
        //     }

        // case 'FETCH_TASKS_FAILED':
        //     return {
        //         ...state,
        //         isLoading: false,
        //         error: action.payload.error
        //     }

        // case "FETCH_TASKS_STARTED":
        //     return {
        //         ...state,
        //         isLoading: true
        //     }

        // add newly created task to store
        // case 'CREATE_TASK':
        //     return { tasks: [...state.tasks, action.payload] }

        // edit property of task that matches id
        // case 'EDIT_TASK':
        //     return {
        //         // iterate through array of tasks
        //         tasks: state.tasks.map(task => {
        //             // if task's id matches
        //             if (task.id === action.payload.id) {
        //                 // return task with updated property
        //                 return { ...task, ...action.payload.params }
        //             }

        //             // if id does not match return unmodified task
        //             return task
        //         })
        //     }

        // add newly created task to store
        case 'CREATE_TASK_SUCCEEDED':
            const { task } = action.payload

            // get projects index from items array
            const projectIndex = state.items.findIndex(
                project => project.id === task.projectId
            )

            // save project in var
            const project = state.items[projectIndex]

            // add new task to projects array of tasks
            const nextProject = {
                ...project,
                tasks: [...project.tasks, task]
            }

            // return items array with updated projects array
            // deletes project and adds nextProject in same index
            return {
                ...state,
                items: [
                    ...state.items.slice(0, projectIndex),
                    nextProject,
                    ...state.items.slice(projectIndex + 1)
                ]
            }

        // return updated list of tasks
        case 'EDIT_TASK_SUCCEEDED': {
            const { task } = action.payload
            const projectIndex = state.items.findIndex(
                project => project.id === task.projectId
            )
            const project = state.items[projectIndex]
            const taskIndex = project.tasks.findIndex(
                t => t.id === task.id
            )
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

        case 'FILTER_TASKS':
            return {
                ...state,
                searchTerm: action.payload.searchTerm
            }

        // delete task with given id from store
        case 'DELETE_TASK_SUCCEEDED':
            const remainingTasks = state.tasks.filter(task => {
                return task.id !== action.payload.id
            })

            return {
                tasks: remainingTasks
            }

        default:
            return state
    }
}


const getTasksById = state => {
    // return empty array if no project selected
    if (!state.page.currentProjectId) {
        return []
    }

    // find in projects object project with matching id
    const currentProject = state.projects.items.find(project => {
        return project.id === state.page.currentProjectId
    })

    // return tasks from selected projected
    return currentProject.tasks
}

// return searchTerm from state
const getSearchTerm = state => state.page.searchTerm

export const getFilteredTasks = createSelector(
    [getTasksById, getSearchTerm],
    (tasks, searchTerm) => {
        // console.log(tasks)
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

const initialPageState = {
    // currentProjectId: null,
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
                searchTerm: action.searchTerm
            }

        default:
            return state
    }
}