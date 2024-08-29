import {
  APIProvider,
  Map,
  AdvancedMarker,
  Marker,
} from '@vis.gl/react-google-maps';

import { useRef, useState, useEffect } from "react";

import { Alert } from "react-bootstrap";

import { Crowd, BadStreet, WellLeetStreet, DarkStreet, Custom, CrossHairs } from "../icons/Icons";

import { SearchBar } from './SerachBar';
import { RecentSearches } from './RecentSearches';
import { DeleteReportCard } from './DeleteReportCard';
import { DirectionMenu, DirectionMenuBottom } from './Directions';
import { ReportDetails } from './ReportDetails';
import { LiveNavigation } from './LiveNavigation';

function GoogleMap(props) {
  const searchbarRef = useRef(null);
  const directionbarRef = useRef(null);
  const reportDetailRef = useRef(null);

  const [searchbarHeight, setSearchbarHeight] = useState('70px');
  const [mapHeight, setMapHeight] = useState('calc(90vh - 70px)');

  const [directionbarHeight, setdirectionbarHeight] = useState('0px');
  const [detailReportHeight, setDetailReportHeight] = useState('0px');

  /* REAL LOCATION 
  const [latitude, setLatitude] = useState(-1);
  const [longitude, setLongitude] = useState(-1); */
  /* FAKE LOCATION (AULE I) */
  const [latitude, setLatitude] = useState(45.06578944176596);
  const [longitude, setLongitude] = useState(7.659046272385926);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (searchbarRef.current) {
      const height = searchbarRef.current.clientHeight;
      setSearchbarHeight(height);
      const dynamicHeight = `calc(90vh - ${height}px)`;
      setMapHeight(dynamicHeight);
    }

    /* REAL LOCATION 
    navigator.geolocation.getCurrentPosition((position) => {
      props.setMapCenter({lat: position.coords.latitude, lng: position.coords.longitude});
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setLoaded(true);
    }); */

    /* FAKE LOCATION (AULE I) */
    setLoaded(true);
  }, [props.openInfo, props.showDirections, props.showFeedbackPopUp]);

  // this allows to show a pop up for 4 sec giving the user feedback on the just done action (eg. edit, add, delete saved address, saved report)
  useEffect(() => {
    if (props.showFeedbackPopUp) {
      setTimeout(() => {
        props.setShowFeedbackPopUp(false);
        props.setActionPerformed('');
      }, 4000);
    }
  }, [props.showFeedbackPopUp]);

  return (
    <APIProvider className='map-component' apiKey='' libraries={["places"]}>
      {
        loaded && !props.showDeleteReportCard && !props.showDirections && !props.openInfo ?
          <div ref={searchbarRef} className='searchbar-container'>
            <SearchBar
              setSelected={setSelectedLocation}
              user={props.user}
              handleUserSwitch={props.handleUserSwitch}
              searchLocationStarted={props.searchLocationStarted}
              setDirtyRecents={props.setDirtyRecents}
              setShowDirections={props.setShowDirections}
              setDestination={props.setDestination}
              setSearchLocationStarted={props.setSearchLocationStarted}
              setChosenChatInfo={props.setChosenChatInfo}
            />
          </div>
          : <></>
      }
      {
        props.openInfo ?
          <div ref={reportDetailRef}>
            <ReportDetails
              reportDetailRef={reportDetailRef}
              setDetailReportHeight={setDetailReportHeight}
              setMapHeight={setMapHeight}
              setOpenInfo={props.setOpenInfo}
              selectedReportDetails={props.selectedReportDetails}
              setShowDeleteReportCard={props.setShowDeleteReportCard}
              setSelectedReportId={props.setSelectedReportId}
              showDirections={props.showDirections}
              setClickedIcon={props.setClickedIcon} 
            />
          </div>
          : <></>
      }
      {
        props.showDirections && !props.showLiveNavigation && !props.openInfo ?
            <div ref={directionbarRef} style={{height: "20vh"}}>
              <DirectionMenu
                startLat={latitude}
                startLng={longitude}
                destination={props.destination}
                setShowDirections={props.setShowDirections}
                setSearchLocationStarted={props.setSearchLocationStarted}
                setdirectionbarHeight={setdirectionbarHeight}
                setMapHeight={setMapHeight}
                routes={routes}
                setRoutes={setRoutes}
                showDeleteReportCard={props.showDeleteReportCard}
                openInfo={props.openInfo}
                setZoomLevel={props.setZoomLevel}
                setMapCenter={props.setMapCenter}
                setDestination={props.setDestination}
                directionbarRef={directionbarRef}
              />
            </div>
          : <></>
      }
      {
        !props.searchLocationStarted && !props.showDeleteReportCard && !props.showLiveNavigation ?
          <>
            <Map
              style={{ width: '100vw', height: mapHeight, marginTop: props.showDirections ? directionbarHeight : props.openInfo ? detailReportHeight : searchbarHeight }}
              zoom={props.zoomLevel}
              center={/*{ lat: latitude, lng: longitude }*/ props.mapCenter}
              mapId='f4ac296f9dbf7782'
              mapTypeControl={false}
              fullscreenControl={false}
              streetViewControl={false}
              onBoundsChanged={(bounds) => { props.setMapCenter(bounds.detail.center) }}
              onZoomChanged={(zoom) => { props.setZoomLevel(zoom.detail.zoom) }}
            >
              <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
                <CrossHairs />
              </AdvancedMarker>
              {
                props.zoomLevel >= 16 ?
                  props.reports.map((report, key) => {
                    return (
                      <ReportMarker
                        setReportId={props.setReportId}
                        rep={report}
                        key={key}
                        zoom={props.zoomLevel}
                        setSelectedReportId={props.setSelectedReportId}
                        clickedIcon={props.clickedIcon} />
                    );
                  })
                  : <></>
              }
              {selectedLocation && <Marker position={selectedLocation} />}
            </Map>
            {
              props.showFeedbackPopUp ? <Alert style={{ height: "6.5vh", position: "fixed", bottom: "8.5vh" }} variant="success" className="dismissable-popup" onClose={() => props.setShowFeedbackPopUp(false)} dismissible>
                <p>Report successfully {props.actionPerformed}!</p>
              </Alert> : <></>
            }
          </>
          :
          <>
            {
              !props.showDeleteReportCard && !props.showLiveNavigation ?
                <RecentSearches
                  maxHeight={mapHeight}
                  marginTopOffset={searchbarHeight}
                  savedAddresses={props.savedAddresses}
                  setDirtyAddresses={props.setDirtyAddresses}
                  user={props.user}
                  setActionPerformed={props.setActionPerformed}
                  setShowFeedbackPopUp={props.setShowFeedbackPopUp}
                  recentAddresses={props.recentAddresses}
                  setShowDirections={props.setShowDirections}
                  setDestination={props.setDestination}
                  setSearchLocationStarted={props.setSearchLocationStarted}
                /> : props.showDeleteReportCard && !props.showLiveNavigation 
                  ? <DeleteReportCard
                    setActionPerformed={props.setActionPerformed}
                    setShowFeedbackPopUp={props.setShowFeedbackPopUp}
                    setDirty={props.setDirty}
                    selectedReportDetails={props.selectedReportDetails}
                    setShowDeleteReportCard={props.setShowDeleteReportCard}
                    setOpenInfo={props.setOpenInfo}
                    setRoutes={setRoutes}
                    /> 
                  : <LiveNavigation
                    setShowLiveNavigation={props.setShowLiveNavigation}
                    setRoutes={setRoutes}
                    setShowDirections={props.setShowDirections}
                    index={props.index}
                    setIndex={props.setIndex}
                    showArrived={props.showArrived}
                    setShowArrived={props.setShowArrived}
                    destination={props.destination} 
                    />
            }
            {
              props.showFeedbackPopUp ?
              <Alert variant="success" className="dismissable-popup" onClose={() => props.setShowFeedbackPopUp(false)} dismissible>
                <Alert.Heading>{props.actionPerformed.toUpperCase()} successfully done!</Alert.Heading>
                <p>
                  The <i>{props.actionPerformed}</i> operation on your saved address has been completed successfully.
                </p>
              </Alert>
              : <></> 
            }
          </>
      }
      {
        props.showDirections && !props.openInfo && !props.showDeleteReportCard && !props.showLiveNavigation ?
          <DirectionMenuBottom
            setShowLiveNavigation={props.setShowLiveNavigation}
            setIndex={props.setIndex}
            setShowArrived={props.setShowArrived}
            destination={props.destination}
          /> : <></>
      }
    </APIProvider>
  );
}

function ReportMarker(props) {
  let space = 0;
  switch(props.zoom) {
    case 16:
      space = 0.00060;
      break;
    case 17:
      space = 0.00040;
      break;
    case 18:
      space = 0.00020;
      break;
  }


  const markerCoordinates = { lat: props.rep.lat - space, lng: props.rep.lng };

  return (
    <AdvancedMarker position={markerCoordinates} onClick={() => props.setSelectedReportId(props.rep.id)}>
      {props.rep.type === 'crowd' ? <Crowd id={props.rep.id} clicked={props.clickedIcon} /> : <></>}
      {props.rep.type === 'badStreet' ? <BadStreet id={props.rep.id} clicked={props.clickedIcon} /> : <></>}
      {props.rep.type === 'wellLitStreet' ? <WellLeetStreet id={props.rep.id} clicked={props.clickedIcon} /> : <></>}
      {props.rep.type === 'darkStreet' ? <DarkStreet id={props.rep.id} clicked={props.clickedIcon} /> : <></>}
      {props.rep.type === 'custom' ? <Custom id={props.rep.id} clicked={props.clickedIcon} /> : <></>}
    </AdvancedMarker>
  );
}

export { GoogleMap }