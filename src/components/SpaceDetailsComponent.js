import React, {useEffect, useState} from 'react';
import {fetchJSON} from "../helpers/api";
import { Row, Col, Dropdown } from 'react-bootstrap/esm/index';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Link, useLocation} from "react-router-dom";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    return (
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
        &#x25bc;
    </a>
)});

const SpaceDetailsComponent = () => {
    // Pagination Config
    const options = {
        sizePerPage: 12,
        hideSizePerPage: true,
        hidePageListOnlyOnePage: true,
        prePageText: '<',
        nextPageText: '>',
    };
    // Column Config
    const columns = [{
        dataField: 'flight_number',
        text: 'No:'
    }, {
        dataField: 'launch_date_utc',
        text: 'Launched (UTC)'
    },  {
        dataField: 'launch_site.site_name',
        text: 'Location'
    },  {
        dataField: 'mission_name',
        text: 'Mission'
    },  {
        dataField: 'rocket.second_stage.payloads[0].orbit',
        text: 'Orbit',
    },  {
        dataField: 'launch_success',
        text: 'Launch Status',
        formatter: launchStatusFormatter
    }, {
        dataField: 'rocket.rocket_name',
        text: 'Rocket'
    }];


    const location = useLocation();
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        setLaunches([]);

        const fetchData = () => {
            const response = fetchJSON(`${location.pathname+location.search}`);
            response.then((data)=>{
                if (data.length > 0) {
                    setLaunches(data);
                    setLoading(false);
                }
            });
        };

        setTimeout(()=>{
            fetchData();
        });

        return(()=>{
            setLoading(true);
            setLaunches([]);
        });
    },[location]);


    function launchStatusFormatter(cell, row) {
        if (cell) {
            return (
                <span className="badge badge-success">Success</span>
            );
        } else if (!cell && row.upcoming) {
            return (
                <span className="badge badge-upcoming">Upcoming</span>
            );
        } else {
            return (
                <span className="badge badge-failed">Failed</span>
            );
        }
    }

    function indication() {
        let text = 'No results found for the specified filter';
        if (loading) {
            return (
                <Loader
                    type="Circles"
                    color="#E4E4E7"
                    className="pt15"
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                />
            );
        } else {
            return (text);
        }
    }

    return (
        <React.Fragment>
            <Row>
                <Col md={6}/>
                <Col md={6} className="custom-toggle">
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                            All Launches
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item eventKey="1"><Link to={'/launches'}>All Launches</Link></Dropdown.Item>
                            <Dropdown.Item eventKey="2"><Link to={'/launches/upcoming'}>Upcoming Launches</Link></Dropdown.Item>
                            <Dropdown.Item eventKey="3"><Link to={'/launches?launch_success=true'}>Successful Launches</Link></Dropdown.Item>
                            <Dropdown.Item eventKey="4"><Link to={'/launches?launch_success=false'}>Failed Launches</Link></Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col>
                    <BootstrapTable keyField='id' data={ launches } columns={ columns } pagination={ paginationFactory(options) } noDataIndication={indication} />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default SpaceDetailsComponent;
