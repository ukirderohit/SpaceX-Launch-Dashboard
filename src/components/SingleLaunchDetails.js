import React from 'react';
import { Row, Col, Image } from 'react-bootstrap/esm/index';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "antd/dist/antd.css";
import {Skeleton } from "antd";
import moment from "moment";
import nasa from '../assets/nasa.svg';
import wordpress from '../assets/wordpress.svg';
import youtube from '../assets/youtube.svg';

const SingleLaunchDetails = (props) => {
    const mission_patch_small = props && props.flight_details && props.flight_details.links ? props.flight_details.links.mission_patch_small : '';
    const mission_name = props && props.flight_details && props.flight_details ? props.flight_details.mission_name : '';
    const launch_date_utc = props && props.flight_details && props.flight_details ? props.flight_details.launch_date_utc : '';
    const site_name = props && props.flight_details && props.flight_details && props.flight_details.launch_site ? props.flight_details.launch_site.site_name : '';
    const rocket_name = props && props.flight_details && props.flight_details && props.flight_details.rocket && props.flight_details.rocket.rocket_name ? props.flight_details.rocket.rocket_name : '';
    const rocket_type = props && props.flight_details && props.flight_details && props.flight_details.rocket && props.flight_details.rocket.rocket_type ? props.flight_details.rocket.rocket_type : '';
    const orbit = props && props.flight_details && props.flight_details && props.flight_details.rocket ? props.flight_details.rocket.second_stage.payloads[0].orbit : '';
    const manufacturer = props && props.flight_details && props.flight_details && props.flight_details.rocket ? props.flight_details.rocket.second_stage.payloads[0].manufacturer : '';
    const nationality = props && props.flight_details && props.flight_details && props.flight_details.rocket ? props.flight_details.rocket.second_stage.payloads[0].nationality : '';
    const payload_type = props && props.flight_details && props.flight_details && props.flight_details.rocket ? props.flight_details.rocket.second_stage.payloads[0].payload_type : '';
    const article_link = props && props.flight_details && props.flight_details && props.flight_details.links ? props.flight_details.links.article_link : '';
    const video_link = props && props.flight_details && props.flight_details && props.flight_details.links ? props.flight_details.links.video_link : '';
    const wikipedia = props && props.flight_details && props.flight_details && props.flight_details.links ? props.flight_details.links.wikipedia : '';
    const flight_number = props && props.flight_details && props.flight_details && props.flight_details.flight_number ? props.flight_details.flight_number : '';

    const launchStatusFormatter = (launch_success, upcoming) => {
        if (launch_success) {
            return (
                <span className="badge badge-success">Success</span>
            );
        } else if (!launch_success && upcoming) {
            return (
                <span className="badge badge-upcoming">Upcoming</span>
            );
        } else {
            return (
                <span className="badge badge-failed">Failed</span>
            );
        }
    };

    return (
        <React.Fragment>
            <Row className="pl-4 pr-4">
                <Col md={2} lg={2} className="p-0 m-0">
                    {props.loading ? <Skeleton.Image /> : <Image src={mission_patch_small} height={72}></Image>}
                </Col>
                <Col>
                    {props.loading ? <Skeleton paragraph={{ rows: 1 }} className="ml-4" size={'small'}/> :
                    <><p className="mb-0">
                        <span className="mission-name mr-4">{mission_name}</span>
                        <span>{launchStatusFormatter(props.flight_details.launch_success, props.flight_details.upcoming)}</span>
                    </p>
                    <p className="mb-0">{rocket_name}</p>
                    <p className="mb-0"><a href={article_link} rel="noreferrer" target="_blank">
                        <Image src={nasa} height={20}></Image>
                    </a><a href={wikipedia} target="_blank" rel="noreferrer" className="ml-1">
                        <Image src={wordpress} height={20}></Image>
                    </a><a href={video_link} target="_blank" rel="noreferrer" className="ml-1">
                        <Image src={youtube} height={20}></Image>
                    </a></p></>}
                </Col>
            </Row>
            <Row className="pl-4 pr-4 pt-2">
                {props.loading ? <Skeleton paragraph={{ rows: 2 }}/> :
                <p>
                    {props.flight_details.details} &nbsp; &nbsp;
                    <span>
                        {wikipedia && <a href={wikipedia}>Wikipedia</a>}
                    </span>
                </p>}
            </Row>
            <Row className="pl-4 pr-4 pt-1">
                <table class="table">
                    <thead></thead>
                    {props.loading ? <Skeleton paragraph={{ rows: 7 }}/> :<tbody>
                        <tr>
                            <td>Flight Number</td>
                            <td>{flight_number}</td>
                        </tr>
                        <tr>
                            <td>Mission Name</td>
                            <td>{mission_name}</td>
                        </tr>
                        <tr>
                            <td>Rocket Type</td>
                            <td>{rocket_type}</td>
                        </tr>
                        <tr>
                            <td>Rocket Name</td>
                            <td>{rocket_name}</td>
                        </tr>
                        <tr>
                            <td>Manufacturer</td>
                            <td>{manufacturer}</td>
                        </tr>
                        <tr>
                            <td>Nationality</td>
                            <td>{nationality}</td>
                        </tr>
                        <tr>
                            <td>Launch Date</td>
                            <td>{moment(launch_date_utc).utc().format('DD MMMM YYYY   HH:mm')}</td>
                        </tr>
                        <tr>
                            <td>Payload Type</td>
                            <td>{payload_type}</td>
                        </tr>
                        <tr>
                            <td>Orbit</td>
                            <td>{orbit}</td>
                        </tr>
                        <tr>
                            <td>Launch Site</td>
                            <td>{site_name}</td>
                        </tr>
                    </tbody>}
                </table>

            </Row>
        </React.Fragment>
    );
};

export default SingleLaunchDetails;
