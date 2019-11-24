import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './counter/index'
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
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">counter</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/counter">
              <Counter />
            </Route>
            <Route path="/">
            </Route>
          </Switch>
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'))