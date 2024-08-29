import {
    useMap,
    useMapsLibrary,
} from '@vis.gl/react-google-maps';

import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCrosshairs, faLocationPin, faPersonWalking, faRoute, faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons';
import { Form, Button } from 'react-bootstrap';

function DirectionMenu(props) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState();
    const [directionsRenderer, setDirectionsRenderer] = useState();
    const leg = props.routes[0]?.legs[0];

    useEffect(() => {
        if (!props.openInfo && props.directionbarRef.current) {
            props.setdirectionbarHeight(0);
            const dynamicHeight = `calc(90vh - 20vh)`;
            props.setMapHeight(dynamicHeight);
        }
    }, []);   

    useEffect(() => {
        if (!routesLibrary || !map) return;

        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map })); /* map where to display directions */
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || props.destination == '') return;

        if (props.routes.length === 0) {
            if (props.destination.includes('Grattacielo Intesa Sanpaolo')) {
                /*1° FAKE DIRECTION FOLLOWING REPORTS */

                const fakeCrowd = { lat: 45.06474499702736, lng: 7.65866709259449 };
                const fakeWellLitStreet = { lat: 45.067266648345516, lng: 7.662679455361895 };

                const waypoints = [
                    {
                        location: new google.maps.LatLng(fakeCrowd),
                        stopover: false
                    },
                    {
                        location: new google.maps.LatLng(fakeWellLitStreet),
                        stopover: false
                    }
                ];

                directionsService.route({
                    origin: new google.maps.LatLng(props.startLat, props.startLng),
                    destination: props.destination,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: true
                }).then(response => {
                    directionsRenderer.setDirections(response);
                    props.setRoutes(response.routes);
                })
            } if (props.destination.includes("Antonio Pigafetta")) {
                /*2° FAKE DIRECTION FOLLOWING REPORTS */

                props.setDestination("Via Antonio Pigafetta, 24, 10129 Torino TO");

                const fakeCrowd = { lat: 45.06474499702736, lng: 7.65866709259449 };
                const wellLitStreet = { lat: 45.0597557242231, lng: 7.65943308152638 };

                const waypoints = [
                    {
                        location: new google.maps.LatLng(fakeCrowd),
                        stopover: false
                    },
                    {
                        location: new google.maps.LatLng(wellLitStreet),
                        stopover: false
                    }
                ];

                directionsService.route({
                    origin: new google.maps.LatLng(props.startLat, props.startLng),
                    destination: props.destination,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(response => {
                    directionsRenderer.setDirections(response);
                    props.setRoutes(response.routes);
                })
            } if (props.destination === "Corso Vittorio Emanuele 133") {
                /*3° FAKE DIRECTION FOLLOWING REPORTS */

                const fakeCrowd = { lat: 45.07019847897992, lng: 7.65610648317792 };

                const waypoints = [
                    {
                        location: new google.maps.LatLng(fakeCrowd),
                        stopover: false
                    }
                ];

                directionsService.route({
                    origin: new google.maps.LatLng(props.startLat, props.startLng),
                    destination: props.destination,
                    waypoints: waypoints,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false
                }).then(response => {
                    directionsRenderer.setDirections(response);
                    props.setRoutes(response.routes);
                })
            } else {
                directionsService.route({
                    origin: new google.maps.LatLng(props.startLat, props.startLng),
                    destination: props.destination,
                    travelMode: google.maps.TravelMode.WALKING,
                    provideRouteAlternatives: false,
                }).then(response => {
                    directionsRenderer.setDirections(response);
                    props.setRoutes(response.routes);
                })
            }
        }
    }, [directionsService, directionsRenderer, props.showDeleteReportCard]);

    if (!leg || props.openInfo || props.showDeleteReportCard) return null;

    return (
        <>
            <FontAwesomeIcon icon={faArrowLeft} size="lg" style={{ position: "absolute", left: "2vw", top: "5.5vh"}} onClick={() => { 
                props.setRoutes([]); 
                directionsRenderer.setMap(null); 
                props.setMapCenter(new google.maps.LatLng(props.startLat, props.startLng));                 
                props.setShowDirections(false); 
                props.setSearchLocationStarted(true); 
                props.setZoomLevel(17);
                }} 
            />
            <div style={{ padding: "3%", marginLeft: "10%" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faCrosshairs} style={{ marginRight: "2vw" }} />
                    <Form.Control style={{ boxShadow: "none" }} readOnly type="text" placeholder="Your position" />
                </div>
                <br/>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faLocationPin} style={{ marginRight: "2vw" }} />
                    <Form.Control style={{ boxShadow: "none" }} readOnly type="text" placeholder={props.destination} />
                </div>
            </div>
        
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "20%" }}>
                <div style={{ display: "flex", flex: "1", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faPersonWalking} style={{ marginRight: "2vw" }} />
                    <Form.Control style={{ border: 0, boxShadow: "none" }} readOnly type="text" placeholder={leg.duration?.text} />
                </div>
                <div style={{ display: "flex", flex: "1", alignItems: "center" }}>
                    <FontAwesomeIcon icon={faRoute} style={{ marginRight: "2vw" }} />
                    <Form.Control style={{ border: 0, boxShadow: "none" }} readOnly type="text" placeholder={leg.distance?.text} />
                </div>
            </div>
        </>
    );
}

function DirectionMenuBottom(props) {
    return (
        <div style={{ padding: "6%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", bottom: "12vh", zIndex: "101", }}>
            <Button variant='primary' className="rounded-5" style={{padding: "4%", paddingLeft: "6%", paddingRight: "6%"}} size='lg' onClick={() => {
                if (["Grattacielo Intesa Sanpaolo, C.so Inghilterra 3, Torino, TO", "Corso Vittorio Emanuele 133, Torino, TO, Italia", "Via Antonio Pigafetta, 24, 10129 Torino TO", "Farmacia Sant'Antonio, Corso Vittorio Emanuele II, Torino, TO, Italia"].indexOf(props.destination) > -1){
                    props.setIndex(0);
                    props.setShowArrived(false);
                    props.setShowLiveNavigation(true);
                }
            }}>
                <FontAwesomeIcon icon={faDiamondTurnRight} style={{ marginRight: "2vw" }} /> Start
            </Button>
        </div>
    );
}

export { DirectionMenu, DirectionMenuBottom }