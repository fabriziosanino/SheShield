import { faHome, faBusinessTime, faListDots, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLongPress } from "@uidotdev/usehooks";
import { useState } from 'react';

import { EditSavedAddress } from './EditSavedAddress';
import { AddNewSavedAddress } from './AddNewSavedAddress';

function RecentSearches(props) {
  const [editSavedAddress, setEditSavedAddress] = useState(false); 
  const [addNewSavedAddress, setAddNewSavedAddress] = useState(false); 
  const [addressToBeEditedKey, setAddressToBeEditedKey] = useState(-1); 

  const handleScroll = (event) => {
    const container = event.target;
    const scrollAmount = event.deltaY;
    container.scrollTo({
      top: 0,
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  };

  const attrs = useLongPress(
    (event) => {  
      setAddressToBeEditedKey(event.nativeEvent.srcElement.id); 
      setEditSavedAddress(true);
    },
    {
      threshold: 500
    } 
  )

  return (
    !editSavedAddress ? 
      !addNewSavedAddress ? 
        <div className="recentsearches-container" style={{ marginTop: props.marginTopOffset, height: props.maxHeight }}>
          <div className='saved-addresses-container' onWheel={handleScroll}>
            {
            props.savedAddresses.map((sa) => {
              return (
              <div className="saved-address" 
                id={sa.id}
                key={sa.id} 
                {... sa.label.toUpperCase() != 'MORE' ? attrs: []}
                  onClick={sa.label.toUpperCase() == 'MORE' ? () => { setAddNewSavedAddress(true) } : () => { props.setDestination(sa.address); props.setShowDirections(true); props.setSearchLocationStarted(false) }}
              >
                <FontAwesomeIcon 
                  icon={sa.label.toUpperCase() == 'HOME' ?
                                              faHome
                                              : 
                                              sa.label.toUpperCase() == 'WORK' ? 
                                                                    faBusinessTime
                                                                    :
                                                                    sa.label.toUpperCase() == 'MORE' ? 
                                                                                          faListDots
                                                                                          :
                                                                                          faStar
                        } 
                  style={{ marginRight: "2%" }}
                />
                {sa.label.toUpperCase()}
              </div>
              );
            })
            }
          </div>
          <div className="recent-searches">
            <p>Recent Searches</p>
            <ul>
              {
                props.recentAddresses.map((ra) => {
                  return(
                    <li key={ra.id} onClick={() => { props.setDestination(ra.address); props.setShowDirections(true); props.setSearchLocationStarted(false); }}>
                      {ra.address}
                    </li>
                  );
                })
              }
            </ul>
          </div>
        </div>
      : <AddNewSavedAddress 
          setAddNewSavedAddress={setAddNewSavedAddress}
          setDirtyAddresses={props.setDirtyAddresses}
          setActionPerformed={props.setActionPerformed}
          setShowFeedbackPopUp={props.setShowFeedbackPopUp}
          user={props.user}
        />
    :  <EditSavedAddress 
          setEditSavedAddress={setEditSavedAddress}
          addressToBeEditedKey={addressToBeEditedKey} 
          savedAddresses={props.savedAddresses}
          setDirtyAddresses={props.setDirtyAddresses}
          setActionPerformed={props.setActionPerformed}
          setShowFeedbackPopUp={props.setShowFeedbackPopUp}
        />
  );
}

export { RecentSearches }