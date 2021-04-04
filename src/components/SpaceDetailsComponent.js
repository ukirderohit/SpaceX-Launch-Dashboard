import React, {useEffect, useState} from 'react';
import {fetchJSON} from "../helpers/api";
import { Row, Col, Dropdown } from 'react-bootstrap/esm/index';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import "antd/dist/antd.css";
import { DatePicker, Modal } from "antd";
import moment from "moment";
import {useLocation, useHistory} from "react-router-dom";
import queryString from 'query-string';
import SingleLaunchDetails from "./SingleLaunchDetails";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    return (
    <a
        href="#"
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

const SpaceDetailsComponent = (props) => {
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
        text: 'Launched (UTC)',
        formatter: launchDateUtcFormatter
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
    const history = useHistory();
    const { RangePicker } = DatePicker;
    const dateFormat = 'YYYY-MM-DD';
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [flightDetails, setFlightDetails] = useState([]);
    const [dateParam, setDateParam] = useState([]);
    const [toggleName, setToggleName] = useState('All Launches');

    useEffect(() => {
        setLoading(true);
        setLaunches([]);
        const fetchData = () => {
            const response = fetchJSON(`${location.pathname+location.search}`);
            if(location.pathname === '/launches/upcoming') {
                setToggleName('Upcoming Launches');
            }
            if(location.pathname === '/launches') {
                let params = queryString.parse(location.search, { ignoreQueryPrefix: true });
                if (params.launch_success === 'true') {
                    setToggleName('Successful Launches');
                } else if (params.launch_success === 'false') {
                    setToggleName('Failed Launches');
                } else {
                    setToggleName('All Launches');
                }
                if (params.start) {
                    setDateParam([params.start,params.end]);
                } else {
                    setDateParam(["",""]);
                }
            }
            response.then((data)=>{
                if (data.length > 0) {
                    setLaunches(data);
                    setLoading(false);
                } else {
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

    function launchDateUtcFormatter(cell, row) {
            return (
                <span>{moment(cell).utc().format('DD MMMM YYYY   HH:mm')}</span>
            );
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
                    timeout={3000}
                />
            );
        } else {
            return text;
        }
    }

    function onChangeRange(dates, dateStrings) {
        let queryParams = [];
        let params = queryString.parse(location.search, { ignoreQueryPrefix: true });
        for (let par in params) {
            if (params[par] !== 'null' || params[par] !== 'undefined') {
                queryParams[par] = params[par]
            }
        }
        if (dateStrings[0]) {
            queryParams['start'] = dateStrings[0];
            queryParams['end'] = dateStrings[1];
        } else {
            delete queryParams['start'];
            delete queryParams['end'];
        }
        history.replace(`${location.pathname}?${queryString.stringify(queryParams)}`);
    };

    const setToggleNameFn = (name, url, isLaunchSuccess='') => {
        let queryParams = [];
        setToggleName(name);
        if (name === 'All Launches') {
            history.replace(`${url}`);
        } else {
            let params = queryString.parse(location.search, { ignoreQueryPrefix: true });
            for (let par in params) {
                if (params[par] !== 'null' || params[par] !== 'undefined') {
                    queryParams[par] = params[par]
                }
            }
            if (isLaunchSuccess) {
                queryParams['launch_success'] = isLaunchSuccess;
            } else {
                delete queryParams['launch_success'];
            }
            if (queryParams) {
                history.replace(`${url}?${queryString.stringify(queryParams)}`);
            } else {
                history.replace(`${url}`);
            }
        }
    };

    const RangePickerValue = () => {
        if (dateParam[0]) {
            return (
                [moment(dateParam[0], dateFormat), moment(dateParam[1], dateFormat)]
            )
        } else {
            return ["",""];
        }
    };
    const fetchSingleLaunchData = (fn) => {
        const response = fetchJSON(`/launches/${fn}`);
        response.then((data)=>{
            setFlightDetails(data);
            setLoading1(false);
        });
    };
    const rowEvents = {
        onClick: (e, row, rowIndex) => {
            setModalShow(true);
            setLoading1(true);
            fetchSingleLaunchData(row.flight_number);
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={6} className="custom-date">
                    <RangePicker
                        className="f-helvi"
                        value={RangePickerValue()}
                        format={dateFormat}
                        ranges={{
                            Today: [moment(), moment()],
                            "This Month": [moment().startOf("month"), moment().endOf("month")],
                            "Past Week": [moment().subtract(1, 'weeks').startOf("isoWeek"), moment().subtract(1, 'weeks').endOf("isoWeek")],
                            "Past Month": [moment().subtract(1, 'months').startOf("months"), moment().subtract(1, 'months').endOf("months")],
                            "Past 3 Months": [moment().subtract(3, 'months').startOf("months"), moment().subtract(1, 'months').endOf("months")],
                            "Past 6 Months": [moment().subtract(6, 'months').startOf("months"), moment().subtract(1, 'months').endOf("months")],
                        }}
                        onChange={onChangeRange}
                    />
                </Col>
                <Col md={6} className="custom-toggle">
                    <Dropdown>
                        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components f-helvi">
                            <span className="f-helvi">{toggleName}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item eventKey="1" onClick={()=>setToggleNameFn('All Launches', '/launches')}>All Launches</Dropdown.Item>
                            <Dropdown.Item eventKey="2" onClick={()=>setToggleNameFn('Upcoming Launches', '/launches/upcoming')}>Upcoming Launches</Dropdown.Item>
                            <Dropdown.Item eventKey="3" onClick={()=>setToggleNameFn('Successful Launches', '/launches', 'true')}>Successful Launches</Dropdown.Item>
                            <Dropdown.Item eventKey="4" onClick={()=>setToggleNameFn('Failed Launches', '/launches', 'false')}>Failed Launches</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col>
                    <BootstrapTable keyField='launch_date_utc' data={ launches } columns={ columns } pagination={ paginationFactory(options) } noDataIndication={indication} rowEvents={ rowEvents } />
                </Col>
            </Row>
            <Modal
                width={'540px'}
                centered
                visible={modalShow}
                footer={null}
                onOk={() => setModalShow(false)}
                onCancel={() => setModalShow(false)}
            >
                <SingleLaunchDetails flight_details={flightDetails} loading={loading1}/>
            </Modal>
        </React.Fragment>
    );
};

export default SpaceDetailsComponent;
