import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Button, Form } from 'react-bootstrap';

function ReportDetails(props) {
    const report = props.selectedReportDetails;

    useEffect(() => {
        if (props.reportDetailRef.current) {
            const height = props.reportDetailRef.current.clientHeight;
            props.setDetailReportHeight("10px");
            const dynamicHeight = `calc(90vh - ${height}px - 10px)`;
            props.setMapHeight(dynamicHeight);
        }
    }, [report]);

    const deleteReport = () => {
        props.setOpenInfo(false);
        props.setShowDeleteReportCard(true);
    }

    return (
        <>
            <FontAwesomeIcon icon={faArrowLeft} style={{ position: "absolute", left: "2vw", top: "7vw" }} onClick={() => { 
                props.setSelectedReportId(undefined); 
                props.setOpenInfo(false);
                props.setClickedIcon(undefined);
                /*if(props.showDirections)
                    props.setHideDirectionMenuForDetails(false);*/
            }} />
            <div style={{ marginRight: "10vw", marginLeft: "12vw", marginTop: "5vw" }}>
                {report.type === 'crowd' ? <h1 style={{textAlign: "center"}}>CROWDED STREET</h1> : <></>}
                {report.type === 'badStreet' ? <h1 style={{ textAlign: "center" }}>BAD STREET</h1> : <></>}
                {report.type === 'wellLitStreet' ? <h1 style={{ textAlign: "center" }}>WELL LIT STREET</h1> : <></>}
                {report.type === 'darkStreet' ? <h1 style={{ textAlign: "center" }}>DARK STREET</h1> : <></>}
                {report.type === 'custom' ? <><h1 style={{ textAlign: "center" }}>CUSTOM REPORT</h1><br/><p>{report.description}</p></> : <></>}
                <ul style={{marginBottom: 0}}>
                    <li>{report.position}</li>
                </ul>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "2vh", marginTop: "2vh" }}>
                    <Form.Control style={{ border: 0, width: "70vw", boxShadow: "none" }} readOnly type="text" placeholder={`Reported ${timestampToDateOrHours(report.timestamp)}`} /> 
                    <Button style={{ marginLeft: "12vw" }} variant="danger" onClick={deleteReport}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            </div>
        </>
    );
}

function timestampToDateOrHours(timestamp) {
    // Get the current timestamp in milliseconds
    const currentTimestamp = Date.now();

    // Calculate the difference in milliseconds
    const timeDifference = Math.floor(currentTimestamp/1000) - timestamp;

    // Calculate the difference in days
    const daysDifference = timeDifference / (60 * 60 * 24);

    // Calculate the remaining hours
    const hoursDifference = timeDifference / (60 * 60);

    if (daysDifference.toFixed(0) > 1) {
        return daysDifference.toFixed(0) + " days ago.";
    } else if (daysDifference.toFixed(0) == 1) {
        return daysDifference.toFixed(0) + " day ago."
    } else if(hoursDifference > 0.6) {
        return (hoursDifference / 0.6).toFixed(0) + " hours ago";
    } else {
        return (hoursDifference * 100).toFixed(0) + " minutes ago";
    }
}

export { ReportDetails }