import { Buttons } from '../components/ReportButtons';
import { Container } from "react-bootstrap";

function Report(props) {
    return (
        <Container>
            <Buttons
                setDirty={props.setDirty}
                hideReportButtons={props.hideReportButtons} 
                setHideReportButtons={props.setHideReportButtons} 
                reportType={props.reportType} 
                setReportType={props.setReportType}
                showFeedbackPopUp={props.showFeedbackPopUp}
                setShowFeedbackPopUp={props.setShowFeedbackPopUp}
                setActionPerformed={props.setActionPerformed}
                setSearchLocationStarted={props.setSearchLocationStarted}
                setMapCenter={props.setMapCenter}
            />
        </Container>
    )
}

export { Report };