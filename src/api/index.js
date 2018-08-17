import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// function to retrieve tasks from api
export function fetchTasks() {
    return client.get('/tasks')
}

// function to add task to api
export function createTask(params) {
    return client.post('/tasks', params)
}

// function to edit task
export function editTask(id, params) {
    return axios.put(`${API_BASE_URL}/tasks/${id}`, params)
}

// function to delete task
export function deleteTask(id) {
    return axios.delete(`${API_BASE_URL}/tasks/${id}`)
}

// function to retrieve projects with embeded tasks
export function fetchProjects() {
    return client.get('/projects?_embed=tasks')
}