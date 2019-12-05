import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './counter/index'
import RouterParams from './router-params/index'
import './css/index.scss';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {
  render(){
    return (
      <Router>
        <div className="app">
          <nav className="header">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/router-params">Router-params</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/router-params">
              <RouterParams />
            </Route>
            <Route path="/counter">
              <Counter />
            </Route>
            <Route path="/">
              <div>
                <h1>
                  HOME
                </h1>
              </div>
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))