import React from 'react';
import logo from './logo.svg';
import {Row, Image} from "react-bootstrap";
import HomePage from './components/HomePage';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Router>
        <Row className="App-topbar">
            <Link to={'/launches'} className="m0auto pt15">
                <Image src={logo} alt="logo" />
            </Link>
        </Row>
        <Route exact path="/">
            <Redirect to="/launches" />
        </Route>
            <Switch>
                <Route
                    exact
                    path="/"
                ><Redirect to="/launches" /></Route>
                <Route path="/launches" component={HomePage} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
