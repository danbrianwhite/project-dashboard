import React from 'react';
import './App.css';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import {Switch, Route, Redirect} from 'react-router';
import {ConnectedRouter, routerReducer, routerMiddleware} from 'react-router-redux';
import reducers from './reducers';

//import Record from './features/record/Record';
import Structure from './features/structure/components/Structure';
import Dashboard from './features/dashboard/components/Dashboard';

import thunk from 'redux-thunk';
import {enableBatching} from 'redux-batched-actions';
import {IntlProvider} from 'react-intl';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

require('es6-promise').polyfill();
require('isomorphic-fetch');

const history = createHistory();

const middleware = [routerMiddleware(history), thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(enableBatching(
    combineReducers({
        ...reducers,
        router: routerReducer
    })),
    composeEnhancers(applyMiddleware(...middleware))
);

export {store}


const App = () => (
    <IntlProvider locale="en">
        <MuiThemeProvider>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Structure>
                        <Switch>
                            {/* non auth routes */}
                            <Route path="/project-dashboard/dashboard" component={Dashboard}/>
                            {/* fall through routes redirect to landing page */}
                            <Redirect to="/project-dashboard/dashboard"/>
                        </Switch>
                    </Structure>
                </ConnectedRouter>
            </Provider>
        </MuiThemeProvider>
    </IntlProvider>
);
export default App