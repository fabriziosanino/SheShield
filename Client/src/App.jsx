import { Go } from './pages/Go';
import { Report } from './pages/Report';
import { Chat } from './pages/Chat';
import { ChatMessages } from './components/ChatMessages';
import { Navigation } from './components/Navigation';

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import API from './API';

function DefaultRoute() {
  return (
    <Container className="App">
      <h1>No data here...</h1>
      <h2>This is not the route you are looking for!</h2>
      <Link to="/">Please go back to main page</Link>
    </Container>
  );
}

function App() {
  const [user, setUser] = useState({
    "id": 0,
    "role": "user"
  });
  const [chosenChatInfo, setChosenChatInfo] = useState('');

  const [zoomLevel, setZoomLevel] = useState(17);
  /* REAL LOCATION */
  /* {lat: 0, lng: 0} */
  /* FAKE LOCATION */
  const [mapCenter, setMapCenter] = useState({ lat: 45.06578944176596, lng: 7.659046272385926 });

  const [reports, setReports] = useState([]);
  const [hideReportButtons, setHideReportButtons] = useState(false);
  const [reportType, setReportType] = useState(undefined);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [recentAddresses, setRecentAddresses] = useState([]);

  const [dirty, setDirty] = useState(true);
  const [dirtyAddresses, setDirtyAddresses] = useState(true);
  const [dirtyRecents, setDirtyRecents] = useState(true);

  const [showFeedbackPopUp, setShowFeedbackPopUp] = useState(false);
  const [actionPerformed, setActionPerformed] = useState('');

  /* State for allowing to change menù page without losing the current data */
  const [showDeleteReportCard, setShowDeleteReportCard] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(undefined);
  const [selectedReportDetails, setSelectedReportDetails] = useState(undefined);

  const [searchLocationStarted, setSearchLocationStarted] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [destination, setDestination] = useState('');

  const [openInfo, setOpenInfo] = useState(false);

  const [showLiveNavigation, setShowLiveNavigation] = useState(false);

  const [clickedIcon, setClickedIcon] = useState(undefined);


  const [selectedNavigation, setSelectedNavigation] = useState(undefined);
  const [index, setIndex] = useState(-1);
  const [showArrived, setShowArrived] = useState(false);
  let interval;

  //useEffect to handle the loading of reports (at mount and whenever new ones are added/deleted)
  useEffect(() => {
    if (dirty) {
      API.getAllReports()
        .then((reports) => {
          setReports(reports);
          setDirty(false);

          setTimeout(() => setDirty(true), 1000 * 60); /* Getting new reports every 1 minute */
        });
    }
  }, [dirty]);

  //useEffect to handle the loading of savedAddresses (at mount and whenever new ones are added/deleted)
  useEffect(() => {
    if (dirtyAddresses || user) {
      API.getSavedAddresses(user.id)
        .then((s) => {
          const s_more = [...s];
          s_more.push({ id: s.lastIndexOf() + 1, label: 'MORE' });
          setSavedAddresses(s_more);
          setDirtyAddresses(false);
        })
        .catch((err) => { });
    }
  }, [dirtyAddresses, user]);

  //useEffect to handle the loading of recentAddresses (at mount and whenever new ones are added)
  useEffect(() => {
    if (dirtyRecents || user) {
      API.getRecentAddresses(user.id)
        .then((s) => {
          setRecentAddresses(s);
          setDirtyRecents(false);
        });
    }
  }, [dirtyRecents, user]);

  useEffect(() => {
    if (selectedReportId != undefined) {
      API.getReport(selectedReportId)
        .then((report) => {
          setSelectedReportDetails(report);

          setClickedIcon(report.id);

          /*if (props.showDirections)
            setHideDirectionMenuForDetails(true);*/

          setOpenInfo(true);
        });
    }
  }, [selectedReportId]);

  useEffect(() => {
    if (showLiveNavigation && index == 0) {
      interval = setInterval(() => {
        //console.log("interval fired");
        setIndex((old) => {
          if(old == -1) {
            clearInterval(interval);
          }
          //console.log(old);
          if(old == 2) {
            setShowArrived(true);
            clearInterval(interval);
            //console.log("show arrived");
            return -1;
          } else {
            return old + 1;
          }
        });
      }, 1000 * 5);
    } else if(!showLiveNavigation) {
      clearInterval(interval);
      //console.log("interval cancelled");
      setIndex(-1);
      setShowArrived(false);
    }
  }, [index]);

  return (
    <div className='app-container'>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element=
            {
              <Go
                reports={reports}
                setReports={setReports}
                setDirty={setDirty}
                handleUserSwitch={setUser}
                savedAddresses={savedAddresses}
                setDirtyAddresses={setDirtyAddresses}
                recentAddresses={recentAddresses}
                setDirtyRecents={setDirtyRecents}
                showFeedbackPopUp={showFeedbackPopUp}
                setShowFeedbackPopUp={setShowFeedbackPopUp}
                actionPerformed={actionPerformed}
                setActionPerformed={setActionPerformed}
                user={user}
                showDeleteReportCard={showDeleteReportCard}
                setShowDeleteReportCard={setShowDeleteReportCard}
                selectedReportId={selectedReportId}
                setSelectedReportId={setSelectedReportId}
                selectedReportDetails={selectedReportDetails}
                setSelectedReportDetails={setSelectedReportDetails}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                searchLocationStarted={searchLocationStarted}
                setSearchLocationStarted={setSearchLocationStarted}
                showDirections={showDirections}
                setShowDirections={setShowDirections}
                destination={destination}
                setDestination={setDestination}
                openInfo={openInfo}
                setOpenInfo={setOpenInfo}
                showLiveNavigation={showLiveNavigation}
                setShowLiveNavigation={setShowLiveNavigation}
                clickedIcon={clickedIcon}
                setClickedIcon={setClickedIcon}
                mapCenter={mapCenter}
                setMapCenter={setMapCenter}
                index={index}
                setIndex={setIndex}
                showArrived={showArrived}
                setShowArrived={setShowArrived}
                setChosenChatInfo={setChosenChatInfo}
              />
            }
          />
          <Route
            path="/report"
            element=
            {
              <Report
                hideReportButtons={hideReportButtons}
                setHideReportButtons={setHideReportButtons}
                reportType={reportType}
                setReportType={setReportType}
                setDirty={setDirty}
                showFeedbackPopUp={showFeedbackPopUp}
                setShowFeedbackPopUp={setShowFeedbackPopUp}
                setActionPerformed={setActionPerformed}
                setSearchLocationStarted={setSearchLocationStarted}
                setMapCenter={setMapCenter}
              />
            }
          />
          <Route path="/chat" element=
            {
              <Chat
                user={user}
                setChosenChatInfo={setChosenChatInfo}
                chosenChatInfo={chosenChatInfo}
              />
            }
          />
          <Route path="/ChatMessages" element=
            {
              <ChatMessages
                user={user}
                setChosenChatInfo={setChosenChatInfo}
                chosenChatInfo={chosenChatInfo}
              />
            }
          />
          <Route path="/*" element={<DefaultRoute />} />
        </Routes>
        <Navigation />
      </BrowserRouter>
    </div>
  )
}

export default App
