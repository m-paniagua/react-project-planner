import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import tasksReducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import registerServiceWorker from './registerServiceWorker';

const rootReducer = (state = {}, action) => {
    return {
        tasks: tasksReducer(state.tasks, action),
        // projects: projectsReducer(state.projects, action)
    }
}

// apply middleware during store creation
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk))
)

ReactDOM.render(
    // make store available to App
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

// enable hot module replacement
if (module.hot) {
    // render component after changes
    module.hot.accept('./App', () => {
        const NextApp = require('./App').default
        ReactDOM.render(
            <Provider store={store}><NextApp /></Provider>,
            document.getElementById('root')
        )

    })

    // when reducer updates, perform hot module replacement
    module.hot.accept('./reducers', () => {
        const nextRootReducer = require('./reducers').default;
        store.replaceReducer(nextRootReducer);
    })
}

registerServiceWorker();
