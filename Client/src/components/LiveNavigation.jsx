import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faLocationPin, faCheck, faRightLong } from '@fortawesome/free-solid-svg-icons';

import { Image, Button, Card } from "react-bootstrap";

import oneIntesa from "../liveNavigationImages/1Intesa.png";
import twoIntesa from "../liveNavigationImages/2Intesa.png";
import threeIntesa from "../liveNavigationImages/3Intesa.png";
import arrivedIntesa from "../liveNavigationImages/ArrivedIntesa.png";

import oneAntonio from "../liveNavigationImages/1Antonio.png";
import twoAntonio from "../liveNavigationImages/2Antonio.png";
import threeAntonio from "../liveNavigationImages/3Antonio.png";
import arrivedAntonio from "../liveNavigationImages/ArrivedAntonio.png";

import oneFarmacia from "../liveNavigationImages/1Farmacia.png";
import twoFarmacia from "../liveNavigationImages/2Farmacia.png";
import threeFarmacia from "../liveNavigationImages/3Farmacia.png";
import arrivedFarmacia from "../liveNavigationImages/ArrivedFarmacia.png";


import oneEmanuele from "../liveNavigationImages/1Emanuele.png";
import twoEmanuele from "../liveNavigationImages/2Emanuele.png";
import threeEmanuele from "../liveNavigationImages/3Emanuele.png";
import arrivedEmanuele from "../liveNavigationImages/ArrivedEmanuele.png";

/*import { useNavigate } from "react-router";*/

function LiveNavigation(props) {
    //const navigate = useNavigate();

    const navigationInfo = {
        "Grattacielo Intesa Sanpaolo, C.so Inghilterra 3, Torino, TO": [
            {
                "direction": "Head southwest",
                "directionIcon": faArrowUp,
                "photo": oneIntesa,
                "distance": "1.2 Km",
                "time": "16 minutes"
            },
            {
                "direction": "Go straight ahead",
                "directionIcon": faArrowUp,
                "photo": twoIntesa,
                "distance": "300 m",
                "time": "3 minutes"
            },
            {
                "direction": "Grattacielo Intesa Sanpaolo",
                "directionIcon": faLocationPin,
                "photo": threeIntesa,
                "distance": "60 m",
                "time": "1 minute"
            },
            {
                "last": arrivedIntesa
            }
        ],
        "Corso Vittorio Emanuele 133, Torino, TO, Italia": [
            {
                "direction": "Head northwest",
                "directionIcon": faArrowUp,
                "photo": oneEmanuele,
                "distance": "1 Km",
                "time": "14 minutes"
            },
            {
                "direction": "Turn right toward C.so Vittorio Emanuele II",
                "directionIcon": faRightLong,
                "photo": twoEmanuele,
                "distance": "100 m",
                "time": "3 minutes"
            },
            {
                "direction": "Corso Vittorio Emanuele 133",
                "directionIcon": faLocationPin,
                "photo": threeEmanuele,
                "distance": "50 m",
                "time": "1 minute"
            },
            {
                "last": arrivedEmanuele
            }
        ],
        "Via Antonio Pigafetta, 24, 10129 Torino TO": [
            {
                "direction": "Head south",
                "directionIcon": faArrowUp,
                "photo": oneAntonio,
                "distance": "1.1 Km",
                "time": "15 minutes"
            },
            {
                "direction": "Go straight ahead",
                "directionIcon": faArrowUp,
                "photo": twoAntonio,
                "distance": "500 m",
                "time": "6 minutes"
            },
            {
                "direction": "Via Antonio Pigafetta, 24",
                "directionIcon": faLocationPin,
                "photo": threeAntonio,
                "distance": "50 m",
                "time": "1 minute"
            },
            {
                "last": arrivedAntonio
            }
        ],
        "Farmacia Sant'Antonio, Corso Vittorio Emanuele II, Torino, TO, Italia": [
            {
                "direction": "Head southwest",
                "directionIcon": faArrowUp,
                "photo": oneFarmacia,
                "distance": "900 m",
                "time": "13 minutes"
            },
            {
                "direction": "Go straight ahead",
                "directionIcon": faArrowUp,
                "photo": twoFarmacia,
                "distance": "200 m",
                "time": "4 minutes"
            },
            {
                "direction": "Farmacia Sant'Antonio",
                "directionIcon": faLocationPin,
                "photo": threeFarmacia,
                "distance": "50 m",
                "time": "1 minute"
            },
            {
                "last": arrivedFarmacia
            }
        ]
    };

    return (
        <>
            {
                !props.showArrived && props.index <= 2 ? <div style={{ height: "10vh" }}>
                    <FontAwesomeIcon icon={navigationInfo[props.destination][props.index].directionIcon} style={{ width: "5vw", height: "11vh", position: "absolute", left: "3vw", top: "7vw" }} />
                    <div style={{ marginLeft: "12vw", marginTop: "6.80vh" }}>
                        <h2><b>{navigationInfo[props.destination][props.index].direction}</b></h2>
                    </div>
                </div> : <></>}

            <div>
                {
                    props.showArrived ?
                        <Image src={navigationInfo[props.destination][3].last} fluid />
                        : <Image src={navigationInfo[props.destination][props.index].photo} fluid />
                }
            </div>
            {
                !props.showArrived ?
                    <>
                        <div style={{ marginLeft: "10vw", position: "absolute", bottom: "14vh"}}>
                            <p style={{ fontSize: "1.2em" }}><b>{navigationInfo[props.destination][props.index].time}</b></p>
                            <p style={{ fontSize: "1.2em" }}>{navigationInfo[props.destination][props.index].distance}</p>
                        </div>
                        {/*<div style={{ marginTop: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button size="sm" className="rounded-5" variant="danger" onClick={() => { navigate('/report') }}>
                                <FontAwesomeIcon icon={faExclamation} style={{ width: "12vw", height: "7vh" }} />
                                <h4><b>Report</b></h4>
                            </Button>
                        </div>*/}
                        <div style={{ marginRight: "10vw", position: "absolute", right: "3vw", bottom: "17vh" }}>
                            <Button size="lg" className="rounded-5" variant="danger" onClick={() => {
                                //clearTimeout(timeOut);
                                props.setIndex(-1);
                                props.setShowArrived(false);
                                props.setRoutes([]);
                                props.setShowLiveNavigation(false);
                            }}>
                                Exit Navigation
                            </Button>
                        </div>
                    </> : <>
                        <Card style={{ margin: "3vh 5vh 0 5vh" }} className="rounded-5 border-5">
                            <Card.Body>
                                <p style={{ fontSize: "1.4em", textAlign: "center" }}>You have reached your destination in the safest way!!</p>
                                <div style={{ marginTop: "5vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <Button size="lg" className="rounded-5" variant="primary" onClick={() => {
                                        //clearTimeout(timeOut);
                                        props.setIndex(-1);
                                        props.setShowArrived(false);
                                        props.setRoutes([]);
                                        props.setShowDirections(false);
                                        props.setShowLiveNavigation(false);
                                    }}>
                                        <FontAwesomeIcon style={{ marginRight: "2vw" }} icon={faCheck} />
                                        Exit
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </>
            }
        </>
    );
}

export { LiveNavigation };
