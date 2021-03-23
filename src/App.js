import React from 'react';
import logo from './logo.svg';
import {Container, Row, Image} from "react-bootstrap";
import SpaceDetailsComponent from './components/SpaceDetailsComponent';
import './App.css';

function App() {
  return (
    <div className="App">
        <Row className="App-topbar">
            <div className="m0auto pt15">
                <Image src={logo} alt="logo" />
            </div>
        </Row>
        <Container>
            <SpaceDetailsComponent/>
        </Container>
    </div>
  );
}

export default App;
