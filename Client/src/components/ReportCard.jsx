import { Button, Card, Row, Col, Form, InputGroup, Spinner } from 'react-bootstrap';
import { CrowdReport, BadStreetReport, WellLitStreetReport, DarkStreetReport, CustomReport } from "../icons/Icons";

import API from '../API';

import { PlacesAutocomplete } from './SearchLocation';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import { faCrosshairs, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ReportCard(props) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [currentLatitude, setCurrentLatitude] = useState(null);
    const [currentLongitude, setCurrentLongitude] = useState(null);
    const [reportDescription, setReportDescription] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();
    let position = "";
    let lat;
    let lng;

    const insertReport = async () => {
        setShowSpinner(true);

        let report = {};

        if (selectedLocation) {
            lat = selectedLocation.lat;
            lng = selectedLocation.lng;

            report = {
                "type": props.type,
                "description": props.type === 'custom' ? reportDescription : "",
                "lat": selectedLocation.lat,
                "lng": selectedLocation.lng
            };
        } else {
            lat = currentLatitude;
            lng = currentLongitude;

            report = {
                "type": props.type,
                "description": props.type === 'custom' ? reportDescription : "",
                "lat": currentLatitude,
                "lng": currentLongitude
            };
        }

        position = await API.getAddressFromCoordinates(lat, lng);

        position = position.data.results[0]?.formatted_address || 'Address not found';

        if (position !== 'Address not found') {
            report.position = position;

            API.insertReport(report)
                .then(() => {
                    props.setMapCenter({ lat: report.lat, lng: report.lng });
                    props.setSearchLocationStarted(false);
                    props.setDirty(true);
                    props.setActionPerformed('saved');
                    props.setShowFeedbackPopUp(true);
                    props.setHideReportButtons(false);
                    navigate("/");
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            console.log("ERROR WHILE GETING ADDRESS FROM LAT LNG");
        }
    }

    const getCurrentLocation = () => {
        /* REAL LOCATION 
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLatitude(position.coords.latitude);
            setCurrentLongitude(position.coords.longitude);
        })*/

        /* FAKE LOCATION (AULE I) */
        setCurrentLatitude(45.06578944176596);
        setCurrentLongitude(7.659046272385926);
    }

    return (
        <>
            <h1 align="center" style={{ margin: '1.5vh' }}>Send Report</h1>
            <Card style={{ margin: "2vh 0 0 0" }} className="rounded-5 border-5">
                <div align='center'>
                    {props.type === 'crowd' ? <CrowdReport /> : <></>}
                    {props.type === 'badStreet' ? <BadStreetReport /> : <></>}
                    {props.type === 'wellLitStreet' ? <WellLitStreetReport /> : <></>}
                    {props.type === 'darkStreet' ? <DarkStreetReport /> : <></>}
                    {props.type === 'custom' ? <CustomReport /> : <></>}
                </div>
                <Card.Body>
                    <Card.Title className='text-center'>
                        {props.type === 'crowd' ? <p>Where do you want to report a <b>CROWDED STREET</b>?</p> : <></>}
                        {props.type === 'badStreet' ? <p>Where do you want to report a <b>BAD STREET</b>?</p> : <></>}
                        {props.type === 'wellLitStreet' ? <p>Where do you want to report a <b>WELL LIT STREET</b>?</p> : <></>}
                        {props.type === 'darkStreet' ? <p>Where do you want to report a <b>DARK STREET</b>?</p> : <></>}
                        {props.type === 'custom' ?
                            <>
                                <p>What do you want to report?</p>
                                <InputGroup>
                                    <Form.Control as="textarea" placeholder='Report something...' value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
                                </InputGroup>
                                <br />
                                <p>Where do you want to place this custom report?</p>
                            </> : <></>}
                    </Card.Title>
                    <div className="d-grid gap-2" style={{ margin: "0 5vh 2vh 7vh" }}>
                        {
                            currentLatitude !== null && currentLongitude !== null ?
                                <Button variant='danger' className="rounded-5" onClick={() => { setCurrentLatitude(null); setCurrentLongitude(null) }}>
                                    Cancel current position
                                    <FontAwesomeIcon icon={faTrash} style={{ margin: "0 1vh" }} />
                                </Button> : <></>
                        }

                        {
                            selectedLocation === null && currentLatitude === null && currentLongitude === null && !showSpinner ?
                                <Button onClick={getCurrentLocation} className="rounded-5" variant='dark'>
                                    Current position
                                    <FontAwesomeIcon icon={faCrosshairs} style={{ margin: "0 1vh" }} />
                                </Button> : <></>
                        }
                    </div>
                    {
                        currentLatitude === null && currentLongitude === null && selectedLocation === null && !showSpinner ? <p align="center"><b>OR</b></p> : <></>
                    }
                    <div className="d-grid gap-2" style={{ margin: "0 6.80vh 9vw" }}>
                        {
                            currentLatitude === null && currentLongitude === null && !showSpinner ?
                                <PlacesAutocomplete setSelected={setSelectedLocation} /> : <></>
                        }
                    </div>
                    <Row>
                        <Col>
                            <div className="d-grid gap-2">
                                <Button variant='secondary' className="rounded-5" onClick={() => props.setHideReportButtons(false)}>
                                    Go Back
                                </Button>
                            </div>
                        </Col>
                        <Col>
                            <div className="d-grid gap-2">
                                {props.type === 'custom' ? <Button onClick={() => insertReport()} variant='primary' className="rounded-5" disabled={((selectedLocation === null && currentLatitude === null && currentLongitude === null) || reportDescription === '') || showSpinner}>
                                    Report
                                    {showSpinner ? <SpinnerCustom /> : <></>}
                                </Button> : <Button onClick={() => insertReport()} variant='primary' className="rounded-5" disabled={(selectedLocation === null && currentLatitude === null && currentLongitude === null) || showSpinner}>
                                    {showSpinner ? <SpinnerCustom /> : <>Report</>}
                                </Button>}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card >
        </>
    );
}

function SpinnerCustom(props) {
    return (
        <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
        />
    );
}

export { ReportCard }