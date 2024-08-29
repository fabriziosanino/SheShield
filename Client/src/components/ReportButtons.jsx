import { CrowdReport, BadStreetReport, WellLitStreetReport, DarkStreetReport, CustomReport } from "../icons/Icons";
import { Button, Row, Col } from 'react-bootstrap'
import { ReportCard } from "./ReportCard";

function Buttons(props) {
  return (
    <>
      {
        !props.hideReportButtons ?
          <>
            <h1 align="center" style={{ margin: '1.5vh' }}>Report</h1>
            <Row>
              <Col>
                <div className="text-center" onClick={() => { props.setReportType("crowd"); props.setHideReportButtons(true); }}><CrowdReport /><div>Crowd</div></div>
              </Col>
              <Col>
                <div className="text-center" onClick={() => { props.setReportType("badStreet"); props.setHideReportButtons(true); }}><BadStreetReport /><div>Bad Street</div></div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center" onClick={() => { props.setReportType("wellLitStreet"); props.setHideReportButtons(true); }}><WellLitStreetReport /><div>Well Lit Street</div></div>
              </Col>
              <Col>
                <div className="text-center" onClick={() => { props.setReportType("darkStreet"); props.setHideReportButtons(true); }}><DarkStreetReport /><div>Dark Street</div></div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-center" onClick={() => { props.setReportType("custom"); props.setHideReportButtons(true); }}><CustomReport /><div>Custom Report</div></div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="d-grid gap-2" style={{ margin: "10vh 3vh" }}>
                  <Button variant="danger" className="rounded-5 border-5" size="lg" onClick={() => window.open('tel:112')}><b>S.O.S</b></Button>
                </div>
              </Col>
            </Row>
          </>
          : <></>}

      {props.hideReportButtons ? <ReportCard 
        setActionPerformed={props.setActionPerformed} 
        showFeedbackPopUp={props.showFeedbackPopUp} 
        setShowFeedbackPopUp={props.setShowFeedbackPopUp} 
        setDirty={props.setDirty} 
        setHideReportButtons={props.setHideReportButtons} 
        type={props.reportType} 
        setSearchLocationStarted={props.setSearchLocationStarted}
        setMapCenter={props.setMapCenter}
        /> : <></>}
    </>
  );
}


export { Buttons }