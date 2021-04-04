import React from 'react';
import {Container} from "react-bootstrap";
import SpaceDetailsComponent from "./SpaceDetailsComponent";

const HomePage = () => {
    return (
        <React.Fragment>
            <Container>
                <SpaceDetailsComponent/>
            </Container>
        </React.Fragment>
    );
};

export default HomePage;