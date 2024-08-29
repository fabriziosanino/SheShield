import { GoogleMap } from '../components/GoogleMap';
import { Container } from "react-bootstrap";

function Go(props) {
  return (
    <Container fluid className="App">
      <GoogleMap
        style={{ width: '100vh', height: '100vh' }}
        reports={props.reports}
        setReports={props.setReports}
        setDirty={props.setDirty}
        handleUserSwitch={props.handleUserSwitch}
        savedAddresses={props.savedAddresses}
        setDirtyAddresses={props.setDirtyAddresses}
        user={props.user}
        recentAddresses={props.recentAddresses}
        setDirtyRecents={props.setDirtyRecents}
        showFeedbackPopUp={props.showFeedbackPopUp}
        setShowFeedbackPopUp={props.setShowFeedbackPopUp}
        actionPerformed={props.actionPerformed}
        setActionPerformed={props.setActionPerformed}
        showDeleteReportCard={props.showDeleteReportCard}
        setShowDeleteReportCard={props.setShowDeleteReportCard}
        selectedReportId={props.selectedReportId}
        setSelectedReportId={props.setSelectedReportId}
        selectedReportDetails={props.selectedReportDetails}
        setSelectedReportDetails={props.setSelectedReportDetails}
        zoomLevel={props.zoomLevel}
        setZoomLevel={props.setZoomLevel}
        searchLocationStarted={props.searchLocationStarted}
        setSearchLocationStarted={props.setSearchLocationStarted}
        showDirections={props.showDirections}
        setShowDirections={props.setShowDirections}
        destination={props.destination}
        setDestination={props.setDestination}
        openInfo={props.openInfo}
        setOpenInfo={props.setOpenInfo}
        showLiveNavigation={props.showLiveNavigation}
        setShowLiveNavigation={props.setShowLiveNavigation}
        clickedIcon={props.clickedIcon}
        setClickedIcon={props.setClickedIcon}
        mapCenter={props.mapCenter}
        setMapCenter={props.setMapCenter}
        index={props.index}
        setIndex={props.setIndex}
        showArrived={props.showArrived}
        setShowArrived={props.setShowArrived}
        setChosenChatInfo={props.setChosenChatInfo}
      />
    </Container>
  );
}

export { Go };