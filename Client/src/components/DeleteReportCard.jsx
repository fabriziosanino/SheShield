import { Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { CrowdReport, BadStreetReport, WellLitStreetReport, DarkStreetReport, CustomReport } from "../icons/Icons";

import { useState, useEffect } from 'react';
import API from '../API';

function DeleteReportCard(props) {
    const report = props.selectedReportDetails;

    const [showSpinner, setShowSpinner] = useState(false);

    const deleteReport = () => {
        setShowSpinner(true);

        API.deleteReport(report.id)
            .then(() => {
                props.setDirty(true);
                setShowSpinner(false);
                props.setRoutes([]);
                props.setActionPerformed("deleted");
                props.setShowFeedbackPopUp(true);
                props.setShowDeleteReportCard(false);
            });
    }

    return (
        <>
            <h1 align="center" style={{ margin: '1.5vh' }}>Delete Report</h1>
            <Card style={{ margin: "2vh", marginTop: "6vh" }} className="rounded-5 border-5">
                <div align='center'>
                    {report.type === 'crowd' ? <CrowdReport /> : <></>}
                    {report.type === 'badStreet' ? <BadStreetReport /> : <></>}
                    {report.type === 'wellLitStreet' ? <WellLitStreetReport /> : <></>}
                    {report.type === 'darkStreet' ? <DarkStreetReport /> : <></>}
                    {report.type === 'custom' ? <CustomReport /> : <></>}
                </div>
                <Card.Body>
                    <Card.Title className='text-center'>
                        {report.type === 'crowd' ? <p>Are you sure you want to delete the <b>CROWDED STREET</b> located in <i>{report.position}</i>?</p> : <></>}
                        {report.type === 'badStreet' ? <p>Are you sure you want to delete the <b>BAD STREET</b> located in <i>{report.position}</i>?</p> : <></>}
                        {report.type === 'wellLitStreet' ? <p>Are you sure you want to delete the <b>WELL LIT STREET</b> located in <i>{report.position}</i>?</p> : <></>}
                        {report.type === 'darkStreet' ? <p>Are you sure you want to delete the <b>DARK STREET</b> located in <i>{report.position}</i>?</p> : <></>}
                        {report.type === 'custom' ? <p>Are you sure you want to delete the <b>CUSTOM REPORT</b> located in <i>{report.position}</i>?</p> : <></>}
                        <p><b>This operation will DELETE the report for all the users.</b></p>
                    </Card.Title>
                    <Row>
                        <Col>
                            <div className="d-grid gap-2">
                                <Button onClick={deleteReport} variant='danger' className="edit-address-button" disabled={showSpinner}>
                                    {showSpinner ? <Spinner /> : <>Yes, <br/> Delete</>}
                                </Button>
                            </div>
                        </Col>
                        <Col>
                            <div className="d-grid gap-2">
                                <Button variant='secondary' className="edit-address-button" onClick={() => {
                                    props.setRoutes([]);
                                    props.setShowDeleteReportCard(false);
                                    props.setOpenInfo(true);
                                }}>
                                    No, <br/> Go Back
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </>
    );
}

export { DeleteReportCard }