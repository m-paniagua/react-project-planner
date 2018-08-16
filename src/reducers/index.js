import { createSelector } from 'reselect'
import { TASK_STATUSES } from '../constants'

// define initial state
const initialState = {
    tasks: [],
    isLoading: false,
    error: null,
    searchTerm: ''
}

// define how to handle action
export default function tasksReducer(state = initialState, action) {
    // check action type
    switch (action.type) {
        // return next state with tasks from payload
        case 'FETCH_TASKS_SUCCEEDED':
            return {
                ...state,
                isLoading: false,
                tasks: action.payload.tasks,
            }

        case 'FETCH_TASKS_FAILED':
            return {
                ...state,
                isLoading: false,
                error: action.payload.error
            }

        case "FETCH_TASKS_STARTED":
            return {
                ...state,
                isLoading: true
            }

        // add newly created task to store
        case 'CREATE_TASK':
            return { tasks: [...state.tasks, action.payload] }

        // edit property of task that matches id
        case 'EDIT_TASK':
            return {
                // iterate through array of tasks
                tasks: state.tasks.map(task => {
                    // if task's id matches
                    if (task.id === action.payload.id) {
                        // return task with updated property
                        return { ...task, ...action.payload.params }
                    }

                    // if id does not match return unmodified task
                    return task
                })
            }

        // add newly created task to store
        case 'CREATE_TASK_SUCCEEDED':
            return {
                ...state,
                tasks: [...state.tasks, action.payload.task]
            }

        // return updated list of tasks
        case 'EDIT_TASK_SUCCEEDED':
            const nextTasks = state.tasks.map(task => {
                if (task.id === action.payload.task.id) {
                    return action.payload.task
                }
                return task
            })
            return {
                ...state,
                tasks: nextTasks
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


const getTasks = state => state.tasks.tasks
const getSearchTerm = state => state.tasks.searchTerm

export const getFilteredTasks = createSelector(
    [getTasks, getSearchTerm],
    (tasks, searchTerm) => {
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
        return grouped
    }
)